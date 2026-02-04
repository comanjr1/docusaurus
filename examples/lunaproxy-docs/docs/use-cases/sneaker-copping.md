---
sidebar_position: 3
---

# Sneaker/Limited Edition Copping

Purchase limited edition items using multiple residential IPs to bypass restrictions.

## The Challenge

Limited edition drops on sites like Nike SNKRS, Adidas Confirmed use:
- Device fingerprinting
- IP reputation analysis
- Location verification
- Queue systems

## Strategy with LunaProxy

```python
# Use multiple IPs simultaneously
proxies = []
for i in range(10):
    proxies.append({
        "http": f"http://user-{i}-rotation:password@gateway.lunaproxy.com:22225"
    })

# Run checkout from multiple IPs
for proxy in proxies:
    checkout_thread = Thread(target=attempt_purchase, args=(proxy,))
    checkout_thread.start()
```

## Best Practices

- **Pre-drop Preparation**: Use IPs from the same region as drop location
- **Speed Optimization**: Residential IPs often faster than datacenter
- **Multiple Sessions**: Run 10-20 checkout attempts simultaneously
- **Sticky Sessions**: Maintain same IP during checkout process

## Next Steps

- [Getting Started](/docs/configuration/getting-started)
- [Sticky Sessions](/docs/configuration/rotation-modes)
