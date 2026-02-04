---
sidebar_position: 1
---

# Introduction to ThorProxy

Welcome to **ThorProxy** - a powerful residential proxy network that provides authentic IP addresses from real home users around the world.

## What is ThorProxy?

ThorProxy is a residential proxy service that uses **real IP addresses** from home users' devices, provided by Internet Service Providers (ISP) such as:

### Indonesian ISPs
- 🇮🇩 Telkomsel
- 🇮🇩 Indihome
- 🇮🇩 XL Axiata
- 🇮🇩 Biznet
- 🇮🇩 First Media

### Global ISPs
- 🇺🇸 Comcast (US)
- 🇬🇧 BT (UK)
- 🇩🇪 Deutsche Telekom (Germany)
- And many more worldwide...

## How ThorProxy Works

ThorProxy operates on a **peer-to-peer network model** in partnership with applications that voluntarily share user bandwidth (with incentives). When you use their residential proxies, you're essentially "borrowing" an IP address from a real user in your target country.

### Unique Architecture

```
[Your Application]
    ↓
[ThorProxy Gateway]
    ↓
[Peer Device with Residential IP]
    ↓
[Target Website]
```

1. **Gateway**: Manages authentication, load balancing, and logging
2. **Peer Network**: Network of users providing bandwidth (similar to Luminati/Bright Data model)
3. **Control Panel**: Dashboard to configure geolocation, rotation, and authentication methods

## Key Benefits

### 🎭 High Legitimacy
- **Natural User Behavior**: IPs come with natural browsing patterns from real devices
- **Clean IP Reputation**: IPs are not flagged as datacenter proxies
- **Bypass Detection**: Difficult to detect by security systems like Cloudflare, Distil, or Akamai

### 🔄 Flexible Rotation
- **Per-Request Rotation**: Get a new residential IP with each request
- **Timer-Based Rotation**: Rotate IPs every 1, 5, 10 minutes, etc.
- **Sticky Sessions**: Maintain the same IP for 1-30 minutes for session-based tasks

### 🌍 Precise Geolocation
- **Country Level**: Select specific countries (US, UK, Japan, Indonesia, etc.)
- **City/Postal Code Level**: Choose IPs from specific cities (e.g., Jakarta or Surabaya)
- **ISP Level**: Filter by specific internet providers (e.g., only Indihome or First Media)

### 🔌 Protocol Support
- **HTTP/HTTPS**: For web browsing and API calls
- **SOCKS5**: For non-HTTP traffic like game connections or specific applications
- **Multiple Ports**: Support for ports 80, 443, 8080, and more

## Common Use Cases

ThorProxy is ideal for:

1. **Web Scraping** - Extract data from websites without getting blocked
2. **Market Research** - Monitor competitor prices across different regions
3. **Sneaker/Limited Edition Copping** - Purchase limited items with multiple IPs
4. **Social Media Management** - Manage multiple accounts safely
5. **Ad Verification** - Verify ads display correctly in different locations
6. **Content Localization** - Test how your website appears in different countries

## Performance Metrics

- **Success Rate**: 95-99% for unblocked requests
- **Pool Size**: Millions of active residential IPs globally
- **Response Time**: 1-3 seconds (slightly slower than datacenter proxies, but worth it for stealth)
- **Uptime**: 99.9% SLA (Service Level Agreement)

## Getting Started

Ready to start using ThorProxy? Check out our [Getting Started Guide](/docs/configuration/getting-started) to set up your first proxy connection.
