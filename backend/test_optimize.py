import requests
import json
import time
import os

def test_optimize():
    url = "http://127.0.0.1:8000/optimize"
    
    # Sample resource list
    payload = {
        "resources": [
            {"filename": "hero_banner_high_res.png", "size": 5242880, "resource_type": "Image"}, # 5MB
            {"filename": "jquery.min.js", "size": 85000, "resource_type": "JS"},
            {"filename": "main.css", "size": 15000, "resource_type": "CSS"},
            {"filename": "tracking_script.js", "size": 250000, "resource_type": "JS"}, # 250KB
            {"filename": "background-video.mp4", "size": 15728640, "resource_type": "Video"} # 15MB
        ]
    }
    
    print(f"Testing optimization endpoint at {url}...")

    try:
        response = requests.post(url, json=payload)
        
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("Suggestions:")
            for i, suggestion in enumerate(data.get("suggestions", []), 1):
                print(f"{i}. {suggestion}")
        else:
            print("Error Response:", response.text)

    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    time.sleep(2)
    test_optimize()
