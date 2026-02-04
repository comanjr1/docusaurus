---
sidebar_position: 4
---

# Social Media Management

Manage multiple social media accounts safely using consistent residential IPs.

## The Problem

Managing multiple accounts triggers security flags:
- Suspicious login patterns
- Same IP for multiple accounts
- Geographic inconsistencies
- Account bans and restrictions

## Solution with LunaProxy

### Static Residential IPs

```python
# Assign dedicated IP to each account
account_1_proxy = {
    "http": "http://user-static-1:password@gateway.lunaproxy.com:22225"
}

account_2_proxy = {
    "http": "http://user-static-2:password@gateway.lunaproxy.com:22225"
}

# Each account always uses the same residential IP
login_account(account_1, account_1_proxy)
login_account(account_2, account_2_proxy)
```

### Geographic Matching

```python
# Indonesian business account uses Indonesian IP
id_proxy = {
    "http": "http://user-country-id-isp-telkomsel:password@gateway.lunaproxy.com:22225"
}

# US business account uses US IP
us_proxy = {
    "http": "http://user-country-us-isp-comcast:password@gateway.lunaproxy.com:22225"
}
```

## Best Practices

- **Sticky Sessions**: Use same IP for entire session (30 min)
- **Location Matching**: Match IP location to account target market
- **ISP Consistency**: Use same ISP type for each account
- **Activity Patterns**: Space out activities to appear natural

## Benefits

- Avoid account suspensions
- Maintain account trust scores
- Manage global accounts safely
- Scale social media operations

## Next Steps

- [Sticky Sessions](/docs/configuration/rotation-modes)
- [ISP Targeting](/docs/configuration/geolocation)
