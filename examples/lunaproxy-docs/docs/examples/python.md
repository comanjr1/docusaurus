---
sidebar_position: 1
---

# Python Examples

Complete Python code examples for using LunaProxy.

## Basic Usage

```python
import requests

# Simple GET request through proxy
proxy_config = {
    "http": "http://username:password@gateway.lunaproxy.com:22225",
    "https": "http://username:password@gateway.lunaproxy.com:22225"
}

response = requests.get("https://api.ipify.org?format=json", proxies=proxy_config)
print(f"Proxy IP: {response.json()['ip']}")
```

## Web Scraping with Rotation

```python
import requests
from bs4 import BeautifulSoup
import time

# Per-request rotation
proxy = {
    "http": "http://user-rotation:password@gateway.lunaproxy.com:22225",
    "https": "http://user-rotation:password@gateway.lunaproxy.com:22225"
}

urls = [
    "https://example.com/page1",
    "https://example.com/page2",
    "https://example.com/page3"
]

for url in urls:
    response = requests.get(url, proxies=proxy)
    soup = BeautifulSoup(response.text, 'html.parser')
    title = soup.find('title').text
    print(f"Page: {url}, Title: {title}")
    time.sleep(1)  # Be respectful
```

## Concurrent Scraping

```python
import concurrent.futures
import requests

def fetch_url(url):
    proxy = {
        "http": "http://user-rotation:password@gateway.lunaproxy.com:22225"
    }
    try:
        response = requests.get(url, proxies=proxy, timeout=30)
        return {'url': url, 'status': response.status_code, 'length': len(response.text)}
    except Exception as e:
        return {'url': url, 'error': str(e)}

urls = [f"https://example.com/page/{i}" for i in range(50)]

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    results = list(executor.map(fetch_url, urls))

for result in results:
    if 'length' in result:
        print(f"✓ {result['url']}: {result['length']} bytes")
    else:
        print(f"✗ {result['url']}: {result['error']}")
```

## Session with Sticky IP

```python
import requests

# Create session with sticky IP (30 minutes)
session = requests.Session()
session.proxies = {
    "http": "http://user-sticky-30min:password@gateway.lunaproxy.com:22225",
    "https": "http://user-sticky-30min:password@gateway.lunaproxy.com:22225"
}

# Login
login_response = session.post(
    "https://example.com/login",
    data={"username": "user", "password": "pass"}
)

# All subsequent requests use same IP
profile = session.get("https://example.com/profile")
settings = session.get("https://example.com/settings")
```

## Location-Specific Scraping

```python
import requests

def get_price_by_location(product_url, city):
    proxy = {
        "http": f"http://user-city-{city}:password@gateway.lunaproxy.com:22225"
    }
    
    response = requests.get(product_url, proxies=proxy)
    # Extract price from response
    return response.json()['price']

# Compare prices in different cities
jakarta_price = get_price_by_location("https://shop.com/product/123", "jakarta")
surabaya_price = get_price_by_location("https://shop.com/product/123", "surabaya")

print(f"Jakarta: Rp {jakarta_price}")
print(f"Surabaya: Rp {surabaya_price}")
print(f"Difference: Rp {abs(jakarta_price - surabaya_price)}")
```

## Error Handling & Retries

```python
import requests
import time

def fetch_with_retry(url, max_retries=3):
    proxy = {
        "http": "http://user-rotation:password@gateway.lunaproxy.com:22225"
    }
    
    for attempt in range(max_retries):
        try:
            response = requests.get(url, proxies=proxy, timeout=30)
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as e:
            if attempt == max_retries - 1:
                raise
            wait_time = 2 ** attempt  # Exponential backoff
            print(f"Retry {attempt + 1}/{max_retries} after {wait_time}s")
            time.sleep(wait_time)

# Usage
try:
    response = fetch_with_retry("https://example.com")
    print(f"Success: {len(response.text)} bytes")
except Exception as e:
    print(f"Failed after retries: {e}")
```

## Using Environment Variables

```python
import os
import requests

# Store credentials in environment variables
username = os.getenv('LUNAPROXY_USER', 'default-user')
password = os.getenv('LUNAPROXY_PASS', 'default-pass')

proxy = {
    "http": f"http://{username}:{password}@gateway.lunaproxy.com:22225",
    "https": f"http://{username}:{password}@gateway.lunaproxy.com:22225"
}

response = requests.get("https://httpbin.org/ip", proxies=proxy)
print(response.json())
```

## Next Steps

- [JavaScript Examples](/docs/examples/javascript)
- [Advanced Examples](/docs/examples/advanced)
- [Web Scraping Guide](/docs/use-cases/web-scraping)
