---
sidebar_position: 3
---

# Advanced Examples

Advanced use cases and optimization techniques.

## Rate Limiting with Token Bucket

```python
import time
import requests
from threading import Lock

class RateLimiter:
    def __init__(self, rate_limit):
        self.rate_limit = rate_limit
        self.tokens = rate_limit
        self.last_update = time.time()
        self.lock = Lock()
    
    def acquire(self):
        with self.lock:
            now = time.time()
            elapsed = now - self.last_update
            self.tokens = min(self.rate_limit, self.tokens + elapsed * self.rate_limit)
            self.last_update = now
            
            if self.tokens >= 1:
                self.tokens -= 1
                return True
            return False

limiter = RateLimiter(rate_limit=2)  # 2 requests per second

proxy = {"http": "http://user-rotation:password@gateway.lunaproxy.com:22225"}

for url in urls:
    while not limiter.acquire():
        time.sleep(0.1)
    response = requests.get(url, proxies=proxy)
```

## Proxy Pool Manager

```python
class ProxyPool:
    def __init__(self, proxies):
        self.proxies = proxies
        self.current = 0
    
    def get_next(self):
        proxy = self.proxies[self.current]
        self.current = (self.current + 1) % len(self.proxies)
        return proxy

# Create pool with different rotation strategies
pool = ProxyPool([
    {"http": "http://user-rotation:pass@gateway.lunaproxy.com:22225"},
    {"http": "http://user-session-5min:pass@gateway.lunaproxy.com:22225"},
    {"http": "http://user-sticky-30min:pass@gateway.lunaproxy.com:22225"}
])

for url in urls:
    proxy = pool.get_next()
    response = requests.get(url, proxies=proxy)
```

## Monitoring & Analytics

```python
import time
from collections import defaultdict

class ProxyMonitor:
    def __init__(self):
        self.stats = defaultdict(lambda: {'success': 0, 'failure': 0, 'total_time': 0})
    
    def record(self, proxy_type, success, response_time):
        self.stats[proxy_type]['success' if success else 'failure'] += 1
        if success:
            self.stats[proxy_type]['total_time'] += response_time
    
    def report(self):
        for proxy_type, data in self.stats.items():
            total = data['success'] + data['failure']
            success_rate = (data['success'] / total * 100) if total > 0 else 0
            avg_time = (data['total_time'] / data['success']) if data['success'] > 0 else 0
            print(f"{proxy_type}: {success_rate:.1f}% success, {avg_time:.2f}s avg")

monitor = ProxyMonitor()

proxy = {"http": "http://user-rotation:password@gateway.lunaproxy.com:22225"}

for url in urls:
    start_time = time.time()
    try:
        response = requests.get(url, proxies=proxy, timeout=30)
        response.raise_for_status()
        monitor.record('rotation', True, time.time() - start_time)
    except:
        monitor.record('rotation', False, 0)

monitor.report()
```

## Next Steps

- [View Dashboard](/proxy-dashboard) - Monitor all proxies in real-time
- [Python Examples](/docs/examples/python)
- [Performance Guide](/docs/performance)
