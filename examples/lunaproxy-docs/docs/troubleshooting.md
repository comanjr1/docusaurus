---
sidebar_position: 9
---

# Troubleshooting

Common issues and solutions when using LunaProxy.

## Connection Issues

### Problem: Unable to Connect to Proxy

**Symptoms**: Connection timeout or refused

**Solutions**:
1. Check credentials are correct
2. Verify proxy address: `gateway.lunaproxy.com:22225`
3. Check firewall settings
4. Try different port (80, 443, 8080)

```python
# Test connection
import requests

try:
    response = requests.get(
        "https://api.ipify.org",
        proxies={"http": "http://user:pass@gateway.lunaproxy.com:22225"},
        timeout=10
    )
    print(f"Connection successful! IP: {response.text}")
except Exception as e:
    print(f"Connection failed: {e}")
```

### Problem: Slow Response Times

**Solutions**:
1. Check [Dashboard](/proxy-dashboard) for proxy status
2. Try different rotation mode
3. Target closer geographic region
4. Use connection pooling

```python
# Optimize with session
session = requests.Session()
session.proxies = proxy_config
# Faster subsequent requests
```

## Authentication Issues

### Problem: 407 Proxy Authentication Required

**Solutions**:
1. Verify username and password
2. Check for special characters in credentials
3. URL-encode credentials if needed

```python
from urllib.parse import quote

username = quote("your-username")
password = quote("your-password")
proxy = f"http://{username}:{password}@gateway.lunaproxy.com:22225"
```

## Request Failures

### Problem: High Failure Rate

**Symptoms**: Many 403, 429, or timeout errors

**Solutions**:
1. Add delays between requests
2. Use per-request rotation
3. Randomize User-Agent headers
4. Check [Dashboard](/proxy-dashboard) for proxy health

```python
import time
import random

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

for url in urls:
    response = requests.get(url, proxies=proxy, headers=headers)
    time.sleep(random.uniform(1, 3))  # Random delay
```

### Problem: Blocked by Target Website

**Solutions**:
1. Switch to different ISP
2. Use sticky sessions for login
3. Mimic browser behavior more closely
4. Reduce request rate

## Geographic Issues

### Problem: Wrong Location Detected

**Solutions**:
1. Verify location parameter in proxy URL
2. Check [Dashboard](/proxy-dashboard) for available locations
3. Try city-level targeting instead of country

```python
# Specify exact city
proxy = {"http": "http://user-city-jakarta:pass@gateway.lunaproxy.com:22225"}
```

## Performance Issues

### Problem: Concurrent Requests Failing

**Solutions**:
1. Reduce max_workers
2. Add retry logic
3. Monitor rate limits

```python
from concurrent.futures import ThreadPoolExecutor

# Reduce from 50 to 20 workers
with ThreadPoolExecutor(max_workers=20) as executor:
    results = executor.map(fetch_url, urls)
```

## Dashboard Issues

### Problem: Cannot Login to Dashboard

**Solutions**:
1. Clear browser cache
2. Try different browser
3. Check JavaScript is enabled
4. Use demo mode (any credentials work)

### Problem: Proxy Status Shows "Checking"

**Explanation**: Proxies are being verified

**What to do**:
1. Wait 30-60 seconds
2. Click refresh button
3. Check back in a few minutes

### Problem: No Proxies Displayed

**Solutions**:
1. Check filters (country, status)
2. Clear all filters
3. Refresh the page
4. Check console for errors

## Error Messages

### "Proxy pool exhausted"

**Meaning**: No available proxies match your criteria

**Solutions**:
1. Broaden location criteria
2. Check [Dashboard](/proxy-dashboard) for availability
3. Try different ISP
4. Contact support

### "Rate limit exceeded"

**Meaning**: Too many requests

**Solutions**:
1. Add delays between requests
2. Reduce concurrent workers
3. Implement exponential backoff

```python
import time

def exponential_backoff(attempt):
    return min(300, 2 ** attempt)  # Max 5 minutes

for attempt in range(5):
    try:
        response = requests.get(url, proxies=proxy)
        break
    except:
        wait = exponential_backoff(attempt)
        print(f"Waiting {wait}s before retry...")
        time.sleep(wait)
```

## Getting Help

### Self-Service Resources
1. [Dashboard](/proxy-dashboard) - Real-time proxy status
2. [Documentation](/docs/intro) - Complete guides
3. [Examples](/docs/examples/python) - Code samples

### Debug Information to Collect
- Error message (full text)
- Proxy configuration used
- Target website URL
- Response code and headers
- Timestamp of issue

### Enable Debug Logging

```python
import logging
import requests

logging.basicConfig(level=logging.DEBUG)

response = requests.get(url, proxies=proxy)
# Detailed logs will be printed
```

## Best Practices to Avoid Issues

✅ **Do**:
- Use appropriate rotation mode
- Implement retry logic
- Monitor via dashboard
- Add delays between requests
- Handle errors gracefully

❌ **Don't**:
- Hammer servers with requests
- Ignore rate limits
- Use same IP for all accounts
- Skip error handling
- Ignore dashboard warnings

## Next Steps

- [Performance Guide](/docs/performance) - Optimize your usage
- [Dashboard](/proxy-dashboard) - Monitor in real-time
- [Configuration](/docs/configuration/getting-started) - Review setup
