---
sidebar_position: 1
---

# Getting Started

Quick guide to start using ThorProxy.

## Step 1: Login

Visit [Login Page](/login) and access the [Proxy Dashboard](/proxy-dashboard) to view all available proxies with complete details including IP, Country, City, State, ISP, and Status.

## Step 2: Basic Configuration

```python
import requests

proxy_config = {
    "http": "http://username:password@gateway.thorproxy.com:22225",
    "https": "http://username:password@gateway.thorproxy.com:22225"
}

response = requests.get("https://api.ipify.org", proxies=proxy_config)
print(f"Your proxy IP: {response.text}")
```

## Next Steps

- [Rotation Modes](/docs/configuration/rotation-modes)
- [Geolocation](/docs/configuration/geolocation)
- [Python Examples](/docs/examples/python)
