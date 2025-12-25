import requests
import json
import time
import subprocess
import sys

def test_service():
    url = "http://127.0.0.1:8000/calculate"
    target_url = "https://ksrce.sriss.co.in/CAMPS/CommonJSP/signin.jsp"
    
    print(f"Testing service at {url} with target {target_url}...")
    
    try:
        response = requests.post(url, json={"url": target_url})
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("Response JSON:")
            print(json.dumps(data, indent=2))
            
            # Basic validation
            assert "total_bytes" in data
            assert "carbon_g" in data
            assert "green_rating" in data
            
            print("\nFetched Resources:")
            for res in data.get("resources", []):
                # Extract filename from URL for better readability
                filename = res['url'].split('/')[-1]
                if not filename or len(filename) > 30:
                     filename = (filename[:27] + '...') if filename else 'unknown'
                
                print(f"- {filename} ({res['resource_type']}) - {res['size']} bytes")
                
            print("\nSUCCESS: Service returned valid response.")
        else:
            print(f"\nFAILURE: Service returned {response.status_code}")
            print(response.text)
            sys.exit(1)
            
    except requests.exceptions.ConnectionError:
        print("\nFAILURE: Could not connect to service. Is it running?")
        sys.exit(1)
    except Exception as e:
        print(f"\nFAILURE: An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Wait a bit for the server to start if run immediately after startup
    time.sleep(2)
    test_service()
