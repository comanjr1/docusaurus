---
sidebar_position: 3
---

# Geolocation Targeting

Target specific geographic locations for your proxy requests.

## Country-Level Targeting

```python
# Indonesia
id_proxy = "http://user-country-id:password@gateway.thorproxy.com:22225"

# United States
us_proxy = "http://user-country-us:password@gateway.thorproxy.com:22225"

# United Kingdom
uk_proxy = "http://user-country-uk:password@gateway.thorproxy.com:22225"

# Germany
de_proxy = "http://user-country-de:password@gateway.thorproxy.com:22225"

# Japan
jp_proxy = "http://user-country-jp:password@gateway.thorproxy.com:22225"
```

## City-Level Targeting

Available for major cities:

```python
# Jakarta, Indonesia
jakarta_proxy = "http://user-city-jakarta:password@gateway.thorproxy.com:22225"

# Surabaya, Indonesia
surabaya_proxy = "http://user-city-surabaya:password@gateway.thorproxy.com:22225"

# New York, US
ny_proxy = "http://user-city-newyork:password@gateway.thorproxy.com:22225"

# London, UK
london_proxy = "http://user-city-london:password@gateway.thorproxy.com:22225"
```

## ISP-Level Filtering

Target specific Internet Service Providers:

```python
# Indonesian ISPs
telkomsel_proxy = "http://user-isp-telkomsel:password@gateway.thorproxy.com:22225"
indihome_proxy = "http://user-isp-indihome:password@gateway.thorproxy.com:22225"
xl_proxy = "http://user-isp-xl:password@gateway.thorproxy.com:22225"

# US ISPs
comcast_proxy = "http://user-isp-comcast:password@gateway.thorproxy.com:22225"
verizon_proxy = "http://user-isp-verizon:password@gateway.thorproxy.com:22225"
```

## Combined Targeting

Combine multiple parameters:

```python
# Jakarta + Telkomsel + Sticky Session
specific_proxy = "http://user-city-jakarta-isp-telkomsel-sticky-30min:password@gateway.thorproxy.com:22225"
```

## Use Cases

- **E-commerce**: See regional pricing
- **Content Testing**: Verify localized content
- **Ad Verification**: Check ads by location
- **Market Research**: Analyze regional trends

## Viewing Available Locations

Login to the [Proxy Dashboard](/proxy-dashboard) to see all available:
- Countries with proxy coverage
- Cities with available IPs
- ISPs in each region
- Real-time proxy status

## Next Steps

- [Authentication Methods](/docs/configuration/authentication)
- [Market Research](/docs/use-cases/market-research)
