---
sidebar_position: 1
---

# Web Scraping

Web scraping is one of the most common use cases for residential proxies. ThorProxy helps you extract data from websites without getting blocked.

## Why Residential Proxies for Web Scraping?

### The Challenge
Modern websites use sophisticated anti-bot systems to detect and block automated scraping:
- **IP-based blocking**: Datacenter IPs are flagged and blocked
- **Rate limiting**: Too many requests from one IP triggers blocks
- **Fingerprinting**: Browser and device fingerprints are analyzed

### The Solution
Residential proxies from ThorProxy bypass these protections:
- **Legitimate IPs**: Appear as real users from ISPs like Telkomsel, Indihome, Comcast
- **IP Rotation**: Different IP for each request avoids rate limits
- **Real Devices**: Natural fingerprints from actual devices
- **High Success Rate**: 95-99% requests succeed

## Example: E-commerce Price Monitoring

```python
import requests
from bs4 import BeautifulSoup

# ThorProxy configuration with rotation
proxy_config = {
    "http": "http://user-rotation:password@gateway.thorproxy.com:22225",
    "https": "http://user-rotation:password@gateway.thorproxy.com:22225"
}

# Scrape multiple product pages
products = [
    "https://tokopedia.com/product/smartphone-a",
    "https://tokopedia.com/product/smartphone-b",
]

for product_url in products:
    # Each request uses a different Indonesian residential IP
    response = requests.get(product_url, proxies=proxy_config)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    price = soup.find('span', class_='price').text
    print(f"Product: {product_url}, Price: {price}")
```

## Best Practices

- ✅ Respect `robots.txt` files
- ✅ Implement reasonable rate limits
- ✅ Use appropriate headers
- ✅ Handle errors gracefully

## Next Steps

- See [Python Examples](/docs/examples/python) for more code
- Configure [Rotation Modes](/docs/configuration/rotation-modes)
