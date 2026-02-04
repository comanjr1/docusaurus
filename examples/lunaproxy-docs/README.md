# LunaProxy Documentation Example

This is an example Docusaurus site that demonstrates how to create comprehensive documentation for a residential proxy service like LunaProxy.

## Features

- 📚 **Complete Documentation**: Detailed guides for all features and use cases
- 🔐 **Login System**: User authentication with session management
- 📊 **Proxy Dashboard**: Interactive dashboard showing all proxy details including:
  - IP Address and Port
  - Country, State, and City
  - ISP (Internet Service Provider)
  - Protocol (HTTP/HTTPS/SOCKS5)
  - Status and Response Time
  - Uptime percentage
- 🔍 **Search & Filter**: Filter proxies by country, status, or search by IP/ISP
- 🌍 **Internationalization**: Supports English and Indonesian languages

## Quick Start

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm start
# or
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
# or
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Demo Usage

1. Visit the home page
2. Click "Login to Dashboard"
3. Enter any username and password (demo mode - any credentials work)
4. View the proxy dashboard with all proxy details
5. Use search and filters to find specific proxies
6. Click refresh to re-check all proxies

## Documentation Structure

```
docs/
├── intro.md                          # Introduction to LunaProxy
├── features.md                       # Detailed features overview
├── architecture.md                   # Technical architecture
├── use-cases/                        # Use case guides
│   ├── web-scraping.md
│   ├── market-research.md
│   ├── sneaker-copping.md
│   └── social-media-management.md
├── configuration/                    # Configuration guides
│   ├── getting-started.md
│   ├── rotation-modes.md
│   ├── geolocation.md
│   └── authentication.md
└── examples/                         # Code examples
    ├── python.md
    ├── javascript.md
    └── advanced.md
```

## Technologies Used

- **Docusaurus 3.7**: Modern static site generator
- **React 19**: For interactive components
- **MDX**: For enhanced markdown documentation
- **CSS Modules**: For component styling

## Key Components

### Login Page (`/login`)
Simple authentication interface with demo mode for testing.

### Proxy Dashboard (`/proxy-dashboard`)
Comprehensive proxy management interface showing:
- Real-time proxy status
- Detailed geographic information
- ISP details
- Performance metrics
- Search and filtering capabilities

## Contributing

This is an example project to demonstrate Docusaurus capabilities for technical documentation. Feel free to use it as a template for your own documentation needs.

## License

MIT
