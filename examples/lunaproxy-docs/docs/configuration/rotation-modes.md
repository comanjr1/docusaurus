---
sidebar_position: 2
---

# Rotation Modes

Choose the right IP rotation strategy for your use case.

## Per-Request Rotation

New IP for every request - ideal for web scraping:

```python
proxy = {
    "http": "http://user-rotation:password@gateway.lunaproxy.com:22225"
}

# Each iteration gets a different IP
for i in range(10):
    response = requests.get(url, proxies=proxy)
    print(f"Request {i}: {response.headers.get('X-Proxy-IP')}")
```

## Timer-Based Rotation

Same IP for specified duration:

```python
# 1 minute
proxy_1min = "http://user-session-1min:password@gateway.lunaproxy.com:22225"

# 5 minutes
proxy_5min = "http://user-session-5min:password@gateway.lunaproxy.com:22225"

# 10 minutes
proxy_10min = "http://user-session-10min:password@gateway.lunaproxy.com:22225"
```

## Sticky Sessions

Maintain same IP for 1-30 minutes - perfect for login sessions:

```python
# 30-minute sticky session
sticky_proxy = {
    "http": "http://user-sticky-30min:password@gateway.lunaproxy.com:22225"
}

# Login and maintain session
session = requests.Session()
session.proxies = sticky_proxy
session.post(login_url, data=credentials)

# All subsequent requests use same IP
for page in pages:
    response = session.get(page)
```

## Comparison Table

| Mode | Use Case | IP Changes |
|------|----------|-----------|
| Per-Request | Web scraping, high volume | Every request |
| Timer (1-10min) | Moderate scraping | Every N minutes |
| Sticky (30min) | Login sessions, social media | Session duration |

## Next Steps

- [Geolocation Targeting](/docs/configuration/geolocation)
- [Web Scraping Guide](/docs/use-cases/web-scraping)
