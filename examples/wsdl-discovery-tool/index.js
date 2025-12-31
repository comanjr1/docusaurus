const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');
const readline = require('readline');
const fs = require('fs').promises;

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt user for input
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Common paths where WSDL files are typically found
const COMMON_PATHS = [
  '/services/',
  '/webservices/',
  '/api/',
  '/soap/',
  '/ws/',
  '/wsdl/',
  '/Services/',
  '/WebServices/',
  '/API/',
  '/SOAP/',
];

// Common WSDL endpoint patterns
const COMMON_SERVICES = [
  'Service',
  'WebService',
  'UserService',
  'AuthService',
  'DataService',
  'APIService',
  'CommonService',
  'MainService',
];

// Configuration
const CONFIG = {
  timeout: 10000,
  maxRedirects: 5,
  userAgent: 'Mozilla/5.0 (compatible; WSDL-Discovery-Tool/1.0)',
};

class WSDLDiscovery {
  constructor(domain) {
    // Remove protocol (http:// or https://), www prefix, and any path components
    // Example: https://www.example.com/path -> example.com
    this.domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    this.baseUrl = `https://${this.domain}`;
    this.httpBaseUrl = `http://${this.domain}`;
    this.foundEndpoints = new Set();
    this.results = [];
  }

  // Make HTTP request with error handling
  async makeRequest(url, method = 'GET') {
    try {
      const response = await axios({
        method,
        url,
        timeout: CONFIG.timeout,
        maxRedirects: CONFIG.maxRedirects,
        headers: {
          'User-Agent': CONFIG.userAgent,
        },
        validateStatus: (status) => status < 500, // Accept any status < 500
      });
      return response;
    } catch (error) {
      return null;
    }
  }

  // Check if URL is a valid WSDL
  async isValidWSDL(url) {
    try {
      const response = await this.makeRequest(url);
      if (!response || response.status !== 200) {
        return false;
      }

      const contentType = response.headers['content-type'] || '';
      const data = response.data;

      // Check if content is XML
      if (!contentType.includes('xml') && !contentType.includes('text') && typeof data !== 'string') {
        return false;
      }

      // Parse and validate WSDL structure
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(data);

      // Check for WSDL-specific elements
      if (result.definitions || result['wsdl:definitions']) {
        return { valid: true, xml: result, raw: data };
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  // Extract service information from WSDL
  extractServiceInfo(wsdlData) {
    try {
      const definitions = wsdlData.xml.definitions || wsdlData.xml['wsdl:definitions'];
      const services = [];

      // Extract service names
      const serviceElements = definitions.service || definitions['wsdl:service'] || [];
      
      for (const service of serviceElements) {
        const serviceName = service.$.name || 'Unknown';
        const operations = [];

        // Extract operations from portType
        const portTypes = definitions.portType || definitions['wsdl:portType'] || [];
        for (const portType of portTypes) {
          const ops = portType.operation || portType['wsdl:operation'] || [];
          for (const op of ops) {
            operations.push(op.$.name);
          }
        }

        services.push({
          name: serviceName,
          operations: operations,
        });
      }

      return services;
    } catch (error) {
      // WSDL parsing failed - structure might be non-standard or incomplete
      return [];
    }
  }

  // Scan common paths for WSDL endpoints
  async scanCommonPaths() {
    console.log('🔍 Scanning common paths...');
    
    for (const path of COMMON_PATHS) {
      for (const service of COMMON_SERVICES) {
        const endpoints = [
          `${this.baseUrl}${path}${service}?wsdl`,
          `${this.baseUrl}${path}${service}.wsdl`,
          `${this.httpBaseUrl}${path}${service}?wsdl`,
          `${this.httpBaseUrl}${path}${service}.wsdl`,
        ];

        for (const endpoint of endpoints) {
          if (this.foundEndpoints.has(endpoint)) continue;
          
          const wsdlData = await this.isValidWSDL(endpoint);
          if (wsdlData) {
            this.foundEndpoints.add(endpoint);
            const services = this.extractServiceInfo(wsdlData);
            
            this.results.push({
              url: endpoint,
              services: services,
              discoveryMethod: 'common-path-scan',
            });

            console.log(`✅ Found: ${endpoint}`);
            if (services.length > 0) {
              services.forEach(svc => {
                console.log(`   Service: ${svc.name}`);
                if (svc.operations.length > 0) {
                  console.log(`   Operations: ${svc.operations.join(', ')}`);
                }
              });
            }
          }
        }
      }
    }
  }

  // Check sitemap.xml for WSDL references
  async scanSitemap() {
    console.log('🗺️  Checking sitemap.xml...');
    
    const sitemapUrls = [
      `${this.baseUrl}/sitemap.xml`,
      `${this.httpBaseUrl}/sitemap.xml`,
    ];

    for (const sitemapUrl of sitemapUrls) {
      const response = await this.makeRequest(sitemapUrl);
      if (response && response.status === 200) {
        try {
          const $ = cheerio.load(response.data, { xmlMode: true });
          const urls = [];
          
          $('loc').each((i, elem) => {
            const url = $(elem).text();
            if (url.includes('.wsdl') || url.includes('?wsdl')) {
              urls.push(url);
            }
          });

          for (const url of urls) {
            if (this.foundEndpoints.has(url)) continue;
            
            const wsdlData = await this.isValidWSDL(url);
            if (wsdlData) {
              this.foundEndpoints.add(url);
              const services = this.extractServiceInfo(wsdlData);
              
              this.results.push({
                url: url,
                services: services,
                discoveryMethod: 'sitemap',
              });

              console.log(`✅ Found in sitemap: ${url}`);
            }
          }
        } catch (error) {
          // Sitemap parsing failed, continue
        }
      }
    }
  }

  // Check robots.txt for service paths
  async scanRobotsTxt() {
    console.log('🤖 Checking robots.txt...');
    
    const robotsUrls = [
      `${this.baseUrl}/robots.txt`,
      `${this.httpBaseUrl}/robots.txt`,
    ];

    for (const robotsUrl of robotsUrls) {
      const response = await this.makeRequest(robotsUrl);
      if (response && response.status === 200) {
        const lines = response.data.split('\n');
        const paths = [];

        for (const line of lines) {
          if (line.toLowerCase().includes('disallow:') || line.toLowerCase().includes('allow:')) {
            const match = line.match(/:\s*(.+)/);
            if (match && (match[1].includes('service') || match[1].includes('wsdl'))) {
              paths.push(match[1].trim());
            }
          }
        }

        for (const path of paths) {
          const urls = [
            `${this.baseUrl}${path}`,
            `${this.baseUrl}${path}?wsdl`,
          ];

          for (const url of urls) {
            if (this.foundEndpoints.has(url)) continue;
            
            const wsdlData = await this.isValidWSDL(url);
            if (wsdlData) {
              this.foundEndpoints.add(url);
              const services = this.extractServiceInfo(wsdlData);
              
              this.results.push({
                url: url,
                services: services,
                discoveryMethod: 'robots-txt',
              });

              console.log(`✅ Found in robots.txt: ${url}`);
            }
          }
        }
      }
    }
  }

  // Crawl homepage for WSDL links
  async crawlHomepage() {
    console.log('🏠 Crawling homepage for WSDL links...');
    
    const homepageUrls = [this.baseUrl, this.httpBaseUrl];

    for (const homepageUrl of homepageUrls) {
      const response = await this.makeRequest(homepageUrl);
      if (response && response.status === 200) {
        try {
          const $ = cheerio.load(response.data);
          const links = [];

          $('a[href]').each((i, elem) => {
            const href = $(elem).attr('href');
            if (href && (href.includes('.wsdl') || href.includes('?wsdl'))) {
              // Handle relative and absolute URLs properly
              let fullUrl = href;
              if (href.startsWith('/')) {
                // Absolute path: /path/to/service?wsdl
                fullUrl = `${this.baseUrl}${href}`;
              } else if (!href.startsWith('http')) {
                // Relative path: path/to/service?wsdl
                fullUrl = `${this.baseUrl}/${href}`;
              }
              // href already starts with http:// or https:// - use as is
              links.push(fullUrl);
            }
          });

          for (const link of links) {
            if (this.foundEndpoints.has(link)) continue;
            
            const wsdlData = await this.isValidWSDL(link);
            if (wsdlData) {
              this.foundEndpoints.add(link);
              const services = this.extractServiceInfo(wsdlData);
              
              this.results.push({
                url: link,
                services: services,
                discoveryMethod: 'homepage-crawl',
              });

              console.log(`✅ Found on homepage: ${link}`);
            }
          }
        } catch (error) {
          // Homepage parsing failed, continue
        }
      }
    }
  }

  // Run all discovery methods
  async discover() {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎯 Starting WSDL Discovery for: ${this.domain}`);
    console.log(`${'='.repeat(60)}\n`);

    await this.crawlHomepage();
    await this.scanSitemap();
    await this.scanRobotsTxt();
    await this.scanCommonPaths();

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 Discovery Complete`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Total WSDL endpoints found: ${this.results.length}\n`);

    return this.results;
  }

  // Save results to JSON file
  async saveResults(filename = 'wsdl-discovery-results.json') {
    const output = {
      domain: this.domain,
      timestamp: new Date().toISOString(),
      totalEndpoints: this.results.length,
      endpoints: this.results,
    };

    await fs.writeFile(filename, JSON.stringify(output, null, 2));
    console.log(`💾 Results saved to: ${filename}\n`);
  }
}

// Main function
async function main() {
  console.log('====================================');
  console.log('   WSDL Endpoint Discovery Tool');
  console.log('====================================');
  console.log('Discover WSDL endpoints from any domain\n');
  console.log('⚠️  IMPORTANT: Only scan domains you own or have permission to test.\n');

  try {
    while (true) {
      const domain = await question('Enter domain to scan (or "exit" to quit): ');
      
      if (domain.toLowerCase() === 'exit' || domain.toLowerCase() === 'quit') {
        console.log('\nGoodbye! 👋');
        break;
      }

      if (!domain || domain.trim() === '') {
        console.log('❌ Please enter a valid domain name\n');
        continue;
      }

      // Create discovery instance and run
      const discovery = new WSDLDiscovery(domain);
      const results = await discovery.discover();

      // Display summary
      if (results.length > 0) {
        console.log('📋 Summary of discovered endpoints:');
        results.forEach((result, index) => {
          console.log(`\n${index + 1}. ${result.url}`);
          console.log(`   Method: ${result.discoveryMethod}`);
          if (result.services.length > 0) {
            result.services.forEach(svc => {
              console.log(`   Service: ${svc.name}`);
              if (svc.operations.length > 0) {
                console.log(`   Operations: ${svc.operations.slice(0, 5).join(', ')}${svc.operations.length > 5 ? '...' : ''}`);
              }
            });
          }
        });

        // Ask if user wants to save results
        const saveChoice = await question('\nSave results to JSON file? (yes/no): ');
        if (saveChoice.toLowerCase() === 'yes' || saveChoice.toLowerCase() === 'y') {
          await discovery.saveResults(`wsdl-results-${domain.replace(/\./g, '-')}.json`);
        }
      } else {
        console.log('❌ No WSDL endpoints found on this domain.');
        console.log('   This could mean:');
        console.log('   - The domain does not expose SOAP web services');
        console.log('   - WSDL endpoints are protected or use non-standard paths');
        console.log('   - The domain is not accessible\n');
      }

      const continueChoice = await question('Scan another domain? (yes/no): ');
      if (continueChoice.toLowerCase() !== 'yes' && continueChoice.toLowerCase() !== 'y') {
        console.log('\nGoodbye! 👋');
        break;
      }
      console.log('\n');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

// Run the application
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { WSDLDiscovery };
