---
sidebar_position: 4
---

# Authentication

Secure your proxy connections with various authentication methods.

## Username/Password Authentication

Most common method:

```python
proxy = {
    "http": "http://username:password@gateway.thorproxy.com:22225",
    "https": "http://username:password@gateway.thorproxy.com:22225"
}

response = requests.get(url, proxies=proxy)
```

## SOCKS5 Authentication

For non-HTTP traffic:

```python
import socks
import socket

socks.set_default_proxy(
    socks.SOCKS5,
    "gateway.thorproxy.com",
    1080,
    username="your-username",
    password="your-password"
)
socket.socket = socks.socksocket
```

## Security Best Practices

### 1. Use Environment Variables

```python
import os

username = os.getenv('THORPROXY_USER')
password = os.getenv('THORPROXY_PASS')

proxy = f"http://{username}:{password}@gateway.thorproxy.com:22225"
```

### 2. Rotate Credentials

Change passwords regularly through the dashboard.

### 3. IP Whitelisting

Restrict proxy access to specific IP addresses for additional security.

## Next Steps

- [Python Examples](/docs/examples/python)
- [JavaScript Examples](/docs/examples/javascript)
