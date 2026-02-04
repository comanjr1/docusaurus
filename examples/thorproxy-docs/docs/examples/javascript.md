---
sidebar_position: 2
---

# JavaScript Examples

Complete JavaScript/Node.js code examples for using ThorProxy.

## Basic Usage with Axios

```javascript
const axios = require('axios');

const proxyConfig = {
  proxy: {
    host: 'gateway.thorproxy.com',
    port: 22225,
    auth: {
      username: 'your-username',
      password: 'your-password'
    }
  }
};

axios.get('https://api.ipify.org?format=json', proxyConfig)
  .then(response => {
    console.log(`Proxy IP: ${response.data.ip}`);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

## Using Request Library

```javascript
const request = require('request');

const options = {
  url: 'https://httpbin.org/ip',
  proxy: 'http://username:password@gateway.thorproxy.com:22225'
};

request(options, (error, response, body) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Response:', JSON.parse(body));
});
```

## Concurrent Requests

```javascript
const axios = require('axios');

async function scrapeUrls(urls) {
  const proxyConfig = {
    proxy: {
      host: 'gateway.thorproxy.com',
      port: 22225,
      auth: {
        username: 'user-rotation',
        password: 'your-password'
      }
    }
  };

  const promises = urls.map(url => 
    axios.get(url, proxyConfig)
      .then(response => ({ url, status: response.status, length: response.data.length }))
      .catch(error => ({ url, error: error.message }))
  );

  const results = await Promise.all(promises);
  return results;
}

// Usage
const urls = [
  'https://example.com/page1',
  'https://example.com/page2',
  'https://example.com/page3'
];

scrapeUrls(urls).then(results => {
  results.forEach(result => {
    if (result.length) {
      console.log(`✓ ${result.url}: ${result.length} bytes`);
    } else {
      console.log(`✗ ${result.url}: ${result.error}`);
    }
  });
});
```

## Location-Specific Requests

```javascript
const axios = require('axios');

async function getPriceByCity(productUrl, city) {
  const proxyConfig = {
    proxy: {
      host: 'gateway.thorproxy.com',
      port: 22225,
      auth: {
        username: `user-city-${city}`,
        password: 'your-password'
      }
    }
  };

  const response = await axios.get(productUrl, proxyConfig);
  return response.data.price;
}

// Compare prices
async function comparePrices() {
  const productUrl = 'https://shop.com/api/product/123';
  
  const jakartaPrice = await getPriceByCity(productUrl, 'jakarta');
  const surabayaPrice = await getPriceByCity(productUrl, 'surabaya');
  
  console.log(`Jakarta: Rp ${jakartaPrice}`);
  console.log(`Surabaya: Rp ${surabayaPrice}`);
  console.log(`Difference: Rp ${Math.abs(jakartaPrice - surabayaPrice)}`);
}

comparePrices();
```

## Using Environment Variables

```javascript
require('dotenv').config();
const axios = require('axios');

const proxyConfig = {
  proxy: {
    host: 'gateway.thorproxy.com',
    port: 22225,
    auth: {
      username: process.env.THORPROXY_USER,
      password: process.env.THORPROXY_PASS
    }
  }
};

axios.get('https://httpbin.org/ip', proxyConfig)
  .then(response => console.log(response.data))
  .catch(error => console.error(error.message));
```

## Next Steps

- [Advanced Examples](/docs/examples/advanced)
- [Python Examples](/docs/examples/python)
