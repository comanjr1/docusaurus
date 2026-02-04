---
sidebar_position: 8
---

# Performance Metrics

Understanding LunaProxy performance characteristics and optimization strategies.

## Key Performance Indicators

### Success Rate
- **Expected**: 95-99% for most websites
- **High Security Sites**: 85-95% (sites with advanced bot detection)
- **Standard Sites**: 98-99%

### Response Time
- **Average**: 1-3 seconds
- **Fast ISPs**: 0.8-1.5 seconds (premium tier)
- **Standard ISPs**: 1.5-3 seconds
- **Note**: Slightly slower than datacenter proxies, but worth it for legitimacy

### Pool Size
- **Global IPs**: Millions of residential IPs
- **Indonesia**: 100,000+ active IPs
- **United States**: 500,000+ active IPs
- **Europe**: 300,000+ active IPs
- **Asia Pacific**: 200,000+ active IPs

### Uptime
- **SLA**: 99.9% uptime guarantee
- **Gateway**: Redundant systems for high availability
- **Peer Network**: Automatic failover to backup peers

## Performance Optimization

### 1. Choose Right Rotation Mode

```python
# High volume scraping: per-request rotation
high_volume = {"http": "http://user-rotation:pass@gateway.lunaproxy.com:22225"}

# Moderate scraping: timer-based
moderate = {"http": "http://user-session-5min:pass@gateway.lunaproxy.com:22225"}

# Session-based: sticky sessions
sessions = {"http": "http://user-sticky-30min:pass@gateway.lunaproxy.com:22225"}
```

### 2. Connection Pooling

Reuse connections for better performance:

```python
import requests
from requests.adapters import HTTPAdapter

session = requests.Session()
adapter = HTTPAdapter(pool_connections=100, pool_maxsize=100)
session.mount('http://', adapter)
session.mount('https://', adapter)
session.proxies = proxy_config
```

### 3. Concurrent Requests

Use threading for parallel requests:

```python
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=20) as executor:
    results = executor.map(fetch_url, urls)
```

## Monitoring Dashboard

Use the [Proxy Dashboard](/proxy-dashboard) to monitor:
- **Real-time Status**: Active/Checking/Inactive proxies
- **Response Times**: Average response time per proxy
- **Uptime Percentage**: Reliability metrics
- **Geographic Distribution**: Available IPs by location

## Benchmarks

### Web Scraping Performance

| Scenario | Requests/Min | Success Rate | Avg Response Time |
|----------|--------------|--------------|-------------------|
| E-commerce | 60-100 | 98% | 1.2s |
| Social Media | 30-50 | 95% | 1.8s |
| News Sites | 100-150 | 99% | 0.9s |
| High Security | 20-40 | 90% | 2.5s |

### Geographic Performance

| Region | Avg Response Time | Success Rate |
|--------|------------------|--------------|
| Indonesia | 1.1s | 98% |
| United States | 1.5s | 97% |
| Europe | 1.8s | 96% |
| Asia Pacific | 1.3s | 97% |

## Next Steps

- [Troubleshooting](/docs/troubleshooting) - Resolve common issues
- [Dashboard](/proxy-dashboard) - Monitor your proxies
