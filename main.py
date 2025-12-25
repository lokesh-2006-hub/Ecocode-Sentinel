from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
from bs4 import BeautifulSoup
import asyncio
from urllib.parse import urljoin, urlparse
from typing import List, Optional
import os
import json
import database  # Import our new database module

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UrlRequest(BaseModel):
    url: str

class ResourceInfo(BaseModel):
    url: str
    size: int
    resource_type: str

class PerformanceMetrics(BaseModel):
    performance_score: float  # 0-100
    fcp: str = None  # First Contentful Paint
    lcp: str = None  # Largest Contentful Paint
    cls: float = None  # Cumulative Layout Shift
    tbt: str = None  # Total Blocking Time

class HostingInfo(BaseModel):
    is_green: bool
    provider: str
    message: str

class CarbonResult(BaseModel):
    total_bytes: int
    carbon_g: float
    green_rating: str
    details: dict
    resources: List[ResourceInfo]
    performance: PerformanceMetrics = None  # Optional performance data
    hosting: Optional[HostingInfo] = None  # New hosting info


async def get_resource_size(client: httpx.AsyncClient, url: str) -> int:
    try:
        response = await client.head(url, timeout=2.0)
        # If HEAD fails or doesn't return content-length, try GET stream
        if 'content-length' in response.headers:
            return int(response.headers['content-length'])
        else:
            # Fallback to a GET request but stream it to avoid downloading massive files just for checking
            # However, accurate size requires full download if server doesn't report it.
            # For this MVP, we'll try a GET request and just check header or read content.
            # Safety: limit download size to avoid hanging on massive files?
            # Let's just do a normal get for now as it's the most robust way if HEAD fails.
            response = await client.get(url, timeout=5.0)
            return len(response.content)
    except Exception:
        return 0

def calculate_carbon(bytes_size: int) -> float:
    # 1 GB = 1024 * 1024 * 1024 bytes
    gb_size = bytes_size / (1024 * 1024 * 1024)
    energy_kwh = gb_size * 0.81
    carbon_g = energy_kwh * 442
    return carbon_g

def get_rating(carbon_g: float) -> str:
    # Example thresholds based on common sustainable web design benchmarks
    # These are illustrative.
    if carbon_g < 0.095: return "A+"
    if carbon_g < 0.186: return "A"
    if carbon_g < 0.341: return "B"
    if carbon_g < 0.493: return "C"
    if carbon_g < 0.656: return "D"
    if carbon_g < 0.850: return "E"
    return "F"

async def fetch_pagespeed_metrics(url: str) -> PerformanceMetrics:
    """Fetch performance metrics from Google PageSpeed Insights API"""
    api_key = os.environ.get("PAGESPEED_API_KEY", "AIzaSyDLOh3EIPjYig072vPja8K6YpKUu_y7gkk")
    pagespeed_url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={url}&key={api_key}&category=performance"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(pagespeed_url, timeout=30.0)
            
            # If PageSpeed fails, just return None instead of crashing
            if response.status_code != 200:
                print(f"PageSpeed API returned {response.status_code}, skipping performance metrics")
                return None
                
            data = response.json()
            
            # Extract metrics from Lighthouse result
            lighthouse = data.get("lighthouseResult", {})
            categories = lighthouse.get("categories", {})
            audits = lighthouse.get("audits", {})
            
            performance_score = categories.get("performance", {}).get("score", 0) * 100
            
            return PerformanceMetrics(
                performance_score=round(performance_score, 1),
                fcp=audits.get("first-contentful-paint", {}).get("displayValue", "N/A"),
                lcp=audits.get("largest-contentful-paint", {}).get("displayValue", "N/A"),
                cls=audits.get("cumulative-layout-shift", {}).get("numericValue", 0),
                tbt=audits.get("total-blocking-time", {}).get("displayValue", "N/A")
            )
    except Exception as e:
        print(f"PageSpeed API error: {e}")
        return None


async def check_hosting(url: str) -> HostingInfo:
    """Check if the website's host uses renewable energy using Green Web Foundation API"""
    try:
        # Improved domain extraction
        parsed = urlparse(url)
        domain = parsed.netloc or parsed.path.split('/')[0]
        
        # Remove port if present (e.g., localhost:8000 -> localhost)
        if ':' in domain:
            domain = domain.split(':')[0]
            
        # Remove 'www.' to get cleaner results from the API
        if domain.startswith('www.'):
            domain = domain[4:]
            
        api_url = f"https://api.thegreenwebfoundation.org/greencheck/{domain}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(api_url, timeout=5.0)
            if response.status_code == 200:
                data = response.json()
                is_green = data.get("green", False)
                provider = data.get("hosted_by", "Unknown Provider")
                
                if is_green:
                    message = f"Great news! This site is hosted by {provider}, which uses renewable energy."
                else:
                    message = f"Hosting provider ({provider}) hasn't confirmed renewable energy use."
                    
                return HostingInfo(is_green=is_green, provider=provider, message=message)
    except Exception as e:
        print(f"Hosting check error: {e}")
    
    return HostingInfo(is_green=False, provider="Unknown", message="Could not determine hosting sustainability.")


@app.post("/calculate", response_model=CarbonResult)
async def calculate_footprint(request: UrlRequest):
    url = request.url
    if not url.startswith("http"):
        url = "https://" + url

    try:
        # Browser-like headers to reduce blocking
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }
        
        async with httpx.AsyncClient(headers=headers, follow_redirects=True) as client:
            # 1. Fetch the main page
            try:
                page_response = await client.get(url, timeout=15.0)
                page_response.raise_for_status()
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 403:
                    raise HTTPException(status_code=403, detail="Access Denied: This website blocks automated scanners (403 Forbidden).")
                elif e.response.status_code == 404:
                    raise HTTPException(status_code=404, detail="Page Not Found: Please check the URL.")
                else:
                    raise HTTPException(status_code=e.response.status_code, detail=f"Site returned error: {e.response.status_code}")
            except httpx.RequestError as e:
                 raise HTTPException(status_code=400, detail=f"Connection Failed: {str(e)}")
            
            html_content = page_response.content
            total_size = len(html_content)
            
            soup = BeautifulSoup(html_content, "html.parser")
            
            resource_data = []
            
            # CSS
            for link in soup.find_all("link", rel="stylesheet"):
                href = link.get("href")
                if href:
                    resource_data.append((urljoin(url, href), "CSS"))
            
            # JS
            for script in soup.find_all("script", src=True):
                src = script.get("src")
                if src:
                    resource_data.append((urljoin(url, src), "JS"))
                    
            # Images
            for img in soup.find_all("img", src=True):
                src = img.get("src")
                if src:
                    resource_data.append((urljoin(url, src), "Image"))

            # Fetch sizes concurrently
            # Limit concurrency to avoid getting blocked
            semaphore = asyncio.Semaphore(20)
            
            async def protected_get_size(res_url):
                async with semaphore:
                    return await get_resource_size(client, res_url)

            tasks = [protected_get_size(res[0]) for res in resource_data]
            sizes = await asyncio.gather(*tasks)
            
            resource_details = []
            for (res_url, res_type), size in zip(resource_data, sizes):
                resource_details.append(ResourceInfo(url=str(res_url), size=size, resource_type=res_type))

            total_size += sum(sizes)
            
            carbon = calculate_carbon(total_size)
            rating = get_rating(carbon)
            
            # Fetch PageSpeed and Hosting metrics in parallel
            performance_data, hosting_data = await asyncio.gather(
                fetch_pagespeed_metrics(url),
                check_hosting(url)
            )
            
            # Save scan to database for historical tracking
            performance_score = performance_data.performance_score if performance_data else None
            database.save_scan(
                url=url,
                carbon_g=round(carbon, 4),
                total_bytes=total_size,
                green_rating=rating,
                performance_score=performance_score,
                resource_count=len(resource_data)
            )
            
            return CarbonResult(
                total_bytes=total_size,
                carbon_g=round(carbon, 4),
                green_rating=rating,
                details={
                    "html_bytes": len(html_content),
                    "resource_count": len(resource_data),
                    "resources_bytes": sum(sizes)
                },
                resources=resource_details,
                performance=performance_data,
                hosting=hosting_data
            )

    except httpx.HTTPStatusError as e:
        if e.response.status_code == 403:
            raise HTTPException(status_code=403, detail="Access Denied: This website blocks automated scanners (403 Forbidden).")
        elif e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Page Not Found: Please check the URL.")
        else:
            raise HTTPException(status_code=e.response.status_code, detail=f"Site returned error: {e.response.status_code}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=400, detail=f"Connection Failed: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# AI Green-Fixer Implementation

class ResourceItem(BaseModel):
    filename: str
    size: int
    resource_type: str

class OptimizeRequest(BaseModel):
    resources: List[ResourceItem]

class Suggestion(BaseModel):
    suggestion: str

class OptimizeResponse(BaseModel):
    suggestions: List[str]

@app.post("/optimize", response_model=OptimizeResponse)
async def optimize_resources(request: OptimizeRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    
    # Fallback suggestions
    fallback_suggestions = [
        "Ensure all images are compressed and served in modern formats like WebP.",
        "Minify CSS and JavaScript files to reduce payload size.",
        "Implement lazy loading for images and non-critical resources."
    ]

    if not api_key:
        print("GEMINI_API_KEY not set, using fallback.")
        return OptimizeResponse(suggestions=fallback_suggestions)
        
    # Prepare prompt
    resource_list_str = "\n".join([f"- {r.filename} ({r.resource_type}): {r.size} bytes" for r in request.resources])
    
    prompt = f"""
    Analyze the following list of web resources and their sizes:
    {resource_list_str}
    
    Provide exactly 3 specific, actionable suggestions to reduce the carbon footprint of this page.
    Focus on the largest or most problematic resources.
    Format the output as a JSON object with a single key 'suggestions' containing a list of 3 strings.
    Example: {{ "suggestions": ["Convert image.png to WebP", "Minify main.js", "Lazy load offscreen images"] }}
    Do not include markdown formatting like ```json.
    """
    
    # Call Gemini via REST API
    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    
    try:
        async with httpx.AsyncClient() as client:
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            response = await client.post(gemini_url, json=payload, timeout=30.0)
            response.raise_for_status()
            
            result = response.json()
            # Extract text from response structure
            # { "candidates": [ { "content": { "parts": [ { "text": "..." } ] } } ] }
            text = result["candidates"][0]["content"]["parts"][0]["text"].strip()
            
            # Clean up potential markdown formatting
            if text.startswith("```"):
                text = text.strip("`")
                if text.startswith("json"):
                    text = text[4:]
            
            data = json.loads(text)
            return OptimizeResponse(suggestions=data.get("suggestions", []))
        
    except Exception as e:
        # Fallback if AI fails or returns bad JSON
        print(f"Gemini API Error: {e}")
        return OptimizeResponse(suggestions=fallback_suggestions)


class ChatMessage(BaseModel):
    role: str
    content: str
    
class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    resources: List[ResourceInfo]  # Changed from ResourceItem to ResourceInfo

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    # Fallback if key missing
    if not api_key:
        return {"reply": "I'm offline right now (API Key missing). But looking at your data, I suggest verifying your image compression!"}

    # Construct context from resources
    formatted_resources = "\n".join([f"- {r.url}: {r.size} bytes ({r.resource_type})" for r in request.resources[:50]]) # Limit to 50 items
    
    system_context = f"""
    You are EcoCode Sentinel, an expert in web sustainability and green coding. 
    You are helping a developer optimize their website.
    The user has scanned a webpage with these resources:
    {formatted_resources}
    
    Answer the user's questions about these resources, code efficiency, and carbon reduction.
    Be concise, technical, and helpful. Use "we" and "our planet" to emphasize the eco-mission.
    """
    
    # Build Gemini history
    contents = []
    
    for i, msg in enumerate(request.messages):
        role = "user" if msg.role == "user" else "model"
        text = msg.content
        if i == len(request.messages) - 1 and role == "user":
             # Inject context into the latest message for relevance
             text = f"{system_context}\n\nUser Question: {text}"
        
        contents.append({
            "role": role,
            "parts": [{"text": text}]
        })

    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    
    try:
        async with httpx.AsyncClient() as client:
            payload = { "contents": contents }
            response = await client.post(gemini_url, json=payload, timeout=30.0)
            
            if response.status_code != 200:
                print(f"Gemini API Error: {response.text}")
                # Check for rate limit
                if response.status_code == 429:
                     return {"reply": "I'm receiving too many signals! (Rate Limit Reached). Please wait a moment."}
                return {"reply": "I'm having trouble connecting to the climate database. Please try again later."}

            result = response.json()
            reply = result["candidates"][0]["content"]["parts"][0]["text"]
            return {"reply": reply}
            
    except Exception as e:
        print(f"Chat Error: {e}")
        return {"reply": "Connection interrupted. Please resend."}

# Historical Tracking Endpoints

@app.get("/history/{url:path}")
async def get_scan_history_endpoint(url: str, limit: int = 30):
    """Get scan history for a specific URL"""
    try:
        history = database.get_scan_history(url, limit)
        return {
            "url": url,
            "scan_count": len(history),
            "scans": history
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")

@app.get("/trends/{url:path}")
async def get_trends_endpoint(url: str, days: int = 90):
    """Get trend analysis for a URL"""
    try:
        trends = database.get_trends(url, days)
        return trends
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating trends: {str(e)}")

@app.get("/recent-scans")
async def get_recent_scans(limit: int = 20):
    """Get list of recently scanned URLs"""
    try:
        urls = database.get_all_scanned_urls(limit)
        return {"recent_urls": urls}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recent scans: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
