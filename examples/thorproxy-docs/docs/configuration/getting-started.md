---
sidebar_position: 1
---

# Getting Started

Quick guide to start using ThorProxy from [ThorData.com](https://www.thordata.com/).

## Step 1: Sign Up for ThorData

1. Visit [ThorData.com](https://www.thordata.com/)
2. Create an account or sign in
3. Navigate to your dashboard to get your API credentials

## Step 2: Login to Dashboard

1. Visit the [Login Page](/login)
2. Enter your credentials (demo mode accepts any username/password)
3. Access the [Proxy Dashboard](/proxy-dashboard)

## Step 3: View Available Proxies

The dashboard displays all available proxies with complete details:
- **IP Address & Port**: Full proxy address
- **Geographic Info**: Country, State, City
- **ISP Details**: Internet Service Provider name
- **Status**: Real-time proxy status (Active/Checking/Inactive)
- **Performance**: Response time and uptime percentage

## Step 4: Basic Configuration

Use your ThorData credentials to configure proxies:

```python
import requests

# Get your credentials from https://www.thordata.com/
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
- Visit [ThorData.com](https://www.thordata.com/) for more information
