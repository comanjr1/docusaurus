---
sidebar_position: 2
---

# Market Research

Monitor competitor prices and analyze market trends across different regions using LunaProxy.

## Use Case: Price Comparison

Track competitor prices in different cities:

```python
# Jakarta prices
jakarta_proxy = {
    "http": "http://user-city-jakarta:password@gateway.lunaproxy.com:22225"
}

# Surabaya prices  
surabaya_proxy = {
    "http": "http://user-city-surabaya:password@gateway.lunaproxy.com:22225"
}

jakarta_price = get_price(product_url, jakarta_proxy)
surabaya_price = get_price(product_url, surabaya_proxy)

print(f"Price difference: {jakarta_price - surabaya_price}")
```

## Benefits

- **Regional Pricing**: See actual prices shown to users in different locations
- **Ad Verification**: Verify ads display correctly in target markets
- **Content Localization**: Test website content across regions
- **Competitor Analysis**: Monitor competitor strategies by location

## Next Steps

- [Configuration Guide](/docs/configuration/getting-started)
- [Geolocation Targeting](/docs/configuration/geolocation)
