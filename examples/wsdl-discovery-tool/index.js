const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');
const readline = require('readline');
const fs = require('fs').promises;
const pLimit = require('p-limit');
const cliProgress = require('cli-progress');
const chalk = require('chalk');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt user for input
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Extended common paths for WSDL discovery
const COMMON_PATHS = [
  '/services/', '/webservices/', '/api/', '/soap/', '/ws/', '/wsdl/',
  '/Services/', '/WebServices/', '/API/', '/SOAP/', '/WS/', '/WSDL/',
  '/soapservices/', '/rest/', '/service/', '/webservice/',
  '/axis/', '/axis2/', '/cxf/', '/jaxws/',
  '/ServiceGateway/', '/WSGateway/', '/SOAPGateway/',
  '/', '/app/', '/application/', '/server/',
];

// Extended service name patterns
const COMMON_SERVICES = [
  'Service', 'WebService', 'UserService', 'AuthService', 'DataService',
  'APIService', 'CommonService', 'MainService', 'CoreService',
  'CustomerService', 'OrderService', 'ProductService', 'PaymentService',
  'AccountService', 'InventoryService', 'CatalogService', 'SearchService',
  'NotificationService', 'MessageService', 'ReportService', 'AdminService',
  'IntegrationService', 'ExternalService', 'InternalService',
];

// Common subdomains that might host web services
const COMMON_SUBDOMAINS = [
  'api', 'ws', 'webservices', 'services', 'soap', 'wsdl',
  'dev', 'test', 'staging', 'uat', 'qa', 'prod', 'production',
  'integration', 'external', 'internal', 'partner',
];

// Common ports for SOAP/web services
const COMMON_PORTS = [
  80, 443, 8080, 8443, 9080, 9443, 8081, 8082, 8888, 9090, 7080, 7443,
];

// Configuration
const CONFIG = {
  timeout: 15000,
  maxRedirects: 5,
  userAgent: 'Mozilla/5.0 (compatible; WSDL-Discovery-Pro/2.0; +https://github.com)',
  concurrentLimit: 10, // Parallel requests
  deepScan: true,
  subdomainScan: true,
  portScan: false, // Disabled by default for safety
  recursiveDepth: 3,
};

class PowerfulWSDLDiscovery {
  constructor(domain, options = {}) {
    // Remove protocol (http:// or https://), www prefix, and any path components
    this.domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    this.baseUrl = `https://${this.domain}`;
    this.httpBaseUrl = `http://${this.domain}`;
    this.foundEndpoints = new Set();
    this.results = [];
    this.scannedUrls = new Set();
    this.discoveredPaths = new Set();
    this.options = { ...CONFIG, ...options };
    this.limiter = pLimit(this.options.concurrentLimit);
    this.progressBar = null;
    this.stats = {
      urlsScanned: 0,
      wsdlFound: 0,
      subdomainsChecked: 0,
      portsScanned: 0,
      startTime: Date.now(),
    };
  }

  // Make HTTP request with error handling and metrics
  async makeRequest(url, method = 'GET', trackMetrics = true) {
    const startTime = Date.now();
    try {
      const response = await axios({
        method,
        url,
        timeout: this.options.timeout,
        maxRedirects: this.options.maxRedirects,
        headers: {
          'User-Agent': this.options.userAgent,
        },
        validateStatus: (status) => status < 500,
      });
      
      if (trackMetrics) {
        this.stats.urlsScanned++;
      }
      
      return {
        ...response,
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      if (trackMetrics) {
        this.stats.urlsScanned++;
      }
      return null;
    }
  }

  // Enhanced WSDL validation with detailed analysis
  async isValidWSDL(url) {
    if (this.scannedUrls.has(url)) {
      return false;
    }
    this.scannedUrls.add(url);

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
        return { 
          valid: true, 
          xml: result, 
          raw: data,
          responseTime: response.responseTime,
          contentLength: data.length,
          server: response.headers['server'] || 'Unknown',
        };
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  // Extract comprehensive service information from WSDL
  extractServiceInfo(wsdlData) {
    try {
      const definitions = wsdlData.xml.definitions || wsdlData.xml['wsdl:definitions'];
      const services = [];

      // Extract namespace information
      const namespaces = definitions.$ || {};
      const targetNamespace = namespaces.targetNamespace || 'Unknown';

      // Extract service names and ports
      const serviceElements = definitions.service || definitions['wsdl:service'] || [];
      
      for (const service of serviceElements) {
        const serviceName = service.$.name || 'Unknown';
        const operations = [];
        const bindings = [];
        const ports = [];

        // Extract ports
        const portElements = service.port || service['wsdl:port'] || [];
        for (const port of portElements) {
          const portName = port.$.name || 'Unknown';
          const binding = port.$.binding || 'Unknown';
          
          // Extract SOAP address
          const soapAddress = port['soap:address'] || port['soap12:address'] || [];
          const location = soapAddress.length > 0 ? soapAddress[0].$.location : 'Unknown';
          
          ports.push({
            name: portName,
            binding: binding,
            location: location,
          });
        }

        // Extract operations from portType
        const portTypes = definitions.portType || definitions['wsdl:portType'] || [];
        for (const portType of portTypes) {
          const ops = portType.operation || portType['wsdl:operation'] || [];
          for (const op of ops) {
            const opName = op.$.name;
            const documentation = op.documentation || op['wsdl:documentation'] || [];
            const doc = documentation.length > 0 ? documentation[0] : '';
            
            operations.push({
              name: opName,
              documentation: typeof doc === 'string' ? doc : (doc._ || ''),
            });
          }
        }

        // Extract binding information
        const bindingElements = definitions.binding || definitions['wsdl:binding'] || [];
        for (const binding of bindingElements) {
          const bindingName = binding.$.name || 'Unknown';
          const bindingType = binding.$.type || 'Unknown';
          
          // Check for SOAP binding
          const soapBinding = binding['soap:binding'] || binding['soap12:binding'] || [];
          const style = soapBinding.length > 0 ? soapBinding[0].$.style : 'Unknown';
          const transport = soapBinding.length > 0 ? soapBinding[0].$.transport : 'Unknown';
          
          bindings.push({
            name: bindingName,
            type: bindingType,
            style: style,
            transport: transport,
          });
        }

        services.push({
          name: serviceName,
          namespace: targetNamespace,
          operations: operations,
          bindings: bindings,
          ports: ports,
        });
      }

      return services;
    } catch (error) {
      // WSDL parsing failed - structure might be non-standard or incomplete
      return [];
    }
  }

  // Advanced path scanning with pattern detection
  async scanCommonPaths() {
    console.log(chalk.cyan('\n🔍 Scanning common paths and patterns...'));
    
    const tasks = [];
    
    for (const path of COMMON_PATHS) {
      for (const service of COMMON_SERVICES) {
        const endpoints = [
          `${this.baseUrl}${path}${service}?wsdl`,
          `${this.baseUrl}${path}${service}.wsdl`,
          `${this.httpBaseUrl}${path}${service}?wsdl`,
          `${this.httpBaseUrl}${path}${service}.wsdl`,
          `${this.baseUrl}${path}${service}/wsdl`,
          `${this.baseUrl}${path}${service}.asmx?wsdl`, // .NET services
          `${this.baseUrl}${path}${service}.svc?wsdl`, // WCF services
        ];

        for (const endpoint of endpoints) {
          if (this.foundEndpoints.has(endpoint)) continue;
          
          tasks.push(
            this.limiter(async () => {
              const wsdlData = await this.isValidWSDL(endpoint);
              if (wsdlData) {
                this.foundEndpoints.add(endpoint);
                const services = this.extractServiceInfo(wsdlData);
                
                this.results.push({
                  url: endpoint,
                  services: services,
                  discoveryMethod: 'common-path-scan',
                  responseTime: wsdlData.responseTime,
                  contentLength: wsdlData.contentLength,
                  server: wsdlData.server,
                });

                this.stats.wsdlFound++;
                console.log(chalk.green(`✅ Found: ${endpoint}`));
                if (services.length > 0) {
                  services.forEach(svc => {
                    console.log(chalk.yellow(`   Service: ${svc.name}`));
                    if (svc.operations.length > 0) {
                      console.log(chalk.gray(`   Operations: ${svc.operations.map(o => o.name).slice(0, 5).join(', ')}${svc.operations.length > 5 ? '...' : ''}`));
                    }
                  });
                }
                
                // Extract path for recursive scanning
                const urlPath = new URL(endpoint).pathname.split('/').slice(0, -1).join('/');
                if (urlPath) {
                  this.discoveredPaths.add(urlPath);
                }
              }
            })
          );
        }
      }
    }

    await Promise.all(tasks);
  }

  // Subdomain enumeration
  async scanSubdomains() {
    if (!this.options.subdomainScan) return;
    
    console.log(chalk.cyan('\n🌐 Scanning subdomains...'));
    
    const tasks = [];
    
    for (const subdomain of COMMON_SUBDOMAINS) {
      const subdomainUrl = `${subdomain}.${this.domain}`;
      
      tasks.push(
        this.limiter(async () => {
          this.stats.subdomainsChecked++;
          
          // Try to access the subdomain
          const httpsUrl = `https://${subdomainUrl}`;
          const httpUrl = `http://${subdomainUrl}`;
          
          for (const baseUrl of [httpsUrl, httpUrl]) {
            const response = await this.makeRequest(baseUrl, 'GET', false);
            if (response && response.status < 400) {
              console.log(chalk.blue(`   Found active subdomain: ${subdomainUrl}`));
              
              // Quick check for common WSDL paths on this subdomain
              const quickPaths = ['/services/', '/webservices/', '/api/', '/soap/'];
              for (const path of quickPaths) {
                const wsdlUrl = `${baseUrl}${path}Service?wsdl`;
                const wsdlData = await this.isValidWSDL(wsdlUrl);
                if (wsdlData) {
                  this.foundEndpoints.add(wsdlUrl);
                  const services = this.extractServiceInfo(wsdlData);
                  
                  this.results.push({
                    url: wsdlUrl,
                    services: services,
                    discoveryMethod: 'subdomain-scan',
                    subdomain: subdomainUrl,
                    responseTime: wsdlData.responseTime,
                  });
                  
                  this.stats.wsdlFound++;
                  console.log(chalk.green(`   ✅ Found on subdomain: ${wsdlUrl}`));
                }
              }
              break; // Found subdomain, no need to try HTTP if HTTPS worked
            }
          }
        })
      );
    }
    
    await Promise.all(tasks);
  }

  // Port scanning for web services
  async scanPorts() {
    if (!this.options.portScan) return;
    
    console.log(chalk.cyan('\n🔌 Scanning common web service ports...'));
    
    const tasks = [];
    
    for (const port of COMMON_PORTS) {
      if (port === 80 || port === 443) continue; // Already scanned
      
      tasks.push(
        this.limiter(async () => {
          this.stats.portsScanned++;
          
          const protocol = [8443, 9443, 7443].includes(port) ? 'https' : 'http';
          const baseUrl = `${protocol}://${this.domain}:${port}`;
          
          // Try common paths on this port
          const quickPaths = ['/services/Service?wsdl', '/api/Service?wsdl'];
          for (const path of quickPaths) {
            const url = `${baseUrl}${path}`;
            const wsdlData = await this.isValidWSDL(url);
            if (wsdlData) {
              this.foundEndpoints.add(url);
              const services = this.extractServiceInfo(wsdlData);
              
              this.results.push({
                url: url,
                services: services,
                discoveryMethod: 'port-scan',
                port: port,
                responseTime: wsdlData.responseTime,
              });
              
              this.stats.wsdlFound++;
              console.log(chalk.green(`   ✅ Found on port ${port}: ${url}`));
            }
          }
        })
      );
    }
    
    await Promise.all(tasks);
  }

  // Recursive directory scanning
  async recursiveScan(depth = 0) {
    if (!this.options.deepScan || depth >= this.options.recursiveDepth) return;
    
    console.log(chalk.cyan(`\n🔎 Deep scan (depth ${depth + 1})...`));
    
    const pathsToScan = Array.from(this.discoveredPaths);
    const tasks = [];
    
    for (const basePath of pathsToScan) {
      // Try to find more services in discovered paths
      for (const service of COMMON_SERVICES.slice(0, 10)) { // Limit to avoid too many requests
        const endpoints = [
          `${this.baseUrl}${basePath}/${service}?wsdl`,
          `${this.baseUrl}${basePath}/${service}.wsdl`,
        ];
        
        for (const endpoint of endpoints) {
          if (this.foundEndpoints.has(endpoint)) continue;
          
          tasks.push(
            this.limiter(async () => {
              const wsdlData = await this.isValidWSDL(endpoint);
              if (wsdlData) {
                this.foundEndpoints.add(endpoint);
                const services = this.extractServiceInfo(wsdlData);
                
                this.results.push({
                  url: endpoint,
                  services: services,
                  discoveryMethod: `recursive-scan-depth-${depth + 1}`,
                  responseTime: wsdlData.responseTime,
                });
                
                this.stats.wsdlFound++;
                console.log(chalk.green(`   ✅ Found: ${endpoint}`));
              }
            })
          );
        }
      }
    }
    
    await Promise.all(tasks);
  }

  // Enhanced sitemap scanning
  async scanSitemap() {
    console.log(chalk.cyan('\n🗺️  Scanning sitemap.xml...'));
    
    const sitemapUrls = [
      `${this.baseUrl}/sitemap.xml`,
      `${this.httpBaseUrl}/sitemap.xml`,
      `${this.baseUrl}/sitemap_index.xml`,
    ];

    for (const sitemapUrl of sitemapUrls) {
      const response = await this.makeRequest(sitemapUrl);
      if (response && response.status === 200) {
        try {
          const $ = cheerio.load(response.data, { xmlMode: true });
          const urls = [];
          
          $('loc').each((i, elem) => {
            const url = $(elem).text();
            if (url.includes('.wsdl') || url.includes('?wsdl') || url.includes('/services/') || url.includes('/webservices/')) {
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
                responseTime: wsdlData.responseTime,
              });

              this.stats.wsdlFound++;
              console.log(chalk.green(`✅ Found in sitemap: ${url}`));
            }
          }
        } catch (error) {
          // Sitemap parsing failed
        }
      }
    }
  }

  // Check robots.txt
  async scanRobotsTxt() {
    console.log(chalk.cyan('\n🤖 Scanning robots.txt...'));
    
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
            if (match && (match[1].includes('service') || match[1].includes('wsdl') || match[1].includes('soap'))) {
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
                responseTime: wsdlData.responseTime,
              });

              this.stats.wsdlFound++;
              console.log(chalk.green(`✅ Found in robots.txt: ${url}`));
            }
          }
        }
      }
    }
  }

  // Enhanced homepage crawling
  async crawlHomepage() {
    console.log(chalk.cyan('\n🏠 Crawling homepage for WSDL links...'));
    
    const homepageUrls = [this.baseUrl, this.httpBaseUrl];

    for (const homepageUrl of homepageUrls) {
      const response = await this.makeRequest(homepageUrl);
      if (response && response.status === 200) {
        try {
          const $ = cheerio.load(response.data);
          const links = [];

          $('a[href]').each((i, elem) => {
            const href = $(elem).attr('href');
            if (href && (href.includes('.wsdl') || href.includes('?wsdl') || href.includes('service'))) {
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
                responseTime: wsdlData.responseTime,
              });

              this.stats.wsdlFound++;
              console.log(chalk.green(`✅ Found on homepage: ${link}`));
            }
          }
        } catch (error) {
          // Homepage parsing failed
        }
      }
    }
  }

  // Generate comprehensive HTML report
  async generateHTMLReport(filename) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WSDL Discovery Report - ${this.domain}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
    h2 { color: #34495e; margin-top: 30px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .stat-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 32px; font-weight: bold; }
    .stat-label { font-size: 14px; opacity: 0.9; margin-top: 5px; }
    .endpoint { background: #ecf0f1; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #3498db; }
    .endpoint-url { font-family: 'Courier New', monospace; color: #2980b9; word-break: break-all; }
    .service { margin-left: 20px; padding: 10px; background: white; margin-top: 10px; border-radius: 4px; }
    .operation { color: #27ae60; font-size: 14px; }
    .method { background: #e8f8f5; padding: 5px 10px; border-radius: 3px; font-size: 12px; color: #16a085; }
    .metrics { font-size: 12px; color: #7f8c8d; margin-top: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #3498db; color: white; }
    tr:hover { background-color: #f5f5f5; }
    .timestamp { color: #7f8c8d; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎯 WSDL Discovery Report</h1>
    <p class="timestamp">Scan completed: ${new Date().toLocaleString()}</p>
    <p><strong>Domain:</strong> ${this.domain}</p>
    
    <h2>📊 Statistics</h2>
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${this.stats.wsdlFound}</div>
        <div class="stat-label">WSDL Endpoints Found</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${this.stats.urlsScanned}</div>
        <div class="stat-label">URLs Scanned</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${this.stats.subdomainsChecked}</div>
        <div class="stat-label">Subdomains Checked</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${Math.round((Date.now() - this.stats.startTime) / 1000)}s</div>
        <div class="stat-label">Scan Duration</div>
      </div>
    </div>
    
    <h2>🔍 Discovered Endpoints</h2>
    ${this.results.map((result, index) => `
      <div class="endpoint">
        <div><strong>#${index + 1}</strong> <span class="method">${result.discoveryMethod}</span></div>
        <div class="endpoint-url">${result.url}</div>
        <div class="metrics">
          Response Time: ${result.responseTime || 'N/A'}ms | 
          Server: ${result.server || 'Unknown'} | 
          Size: ${result.contentLength ? Math.round(result.contentLength / 1024) + 'KB' : 'N/A'}
        </div>
        ${result.services.map(svc => `
          <div class="service">
            <strong>Service:</strong> ${svc.name}<br>
            <strong>Namespace:</strong> ${svc.namespace || 'N/A'}<br>
            ${svc.operations.length > 0 ? `
              <strong>Operations (${svc.operations.length}):</strong><br>
              ${svc.operations.slice(0, 10).map(op => `<span class="operation">• ${op.name}</span>`).join('<br>')}
              ${svc.operations.length > 10 ? `<br><em>... and ${svc.operations.length - 10} more</em>` : ''}
            ` : ''}
          </div>
        `).join('')}
      </div>
    `).join('')}
    
    ${this.results.length === 0 ? '<p>No WSDL endpoints were discovered.</p>' : ''}
  </div>
</body>
</html>
    `;
    
    await fs.writeFile(filename, html);
    console.log(chalk.green(`\n📄 HTML report generated: ${filename}`));
  }

  // Run all discovery methods
  async discover() {
    console.log(chalk.bold.cyan('\n' + '='.repeat(70)));
    console.log(chalk.bold.white('🚀 POWERFUL WSDL DISCOVERY TOOL v2.0'));
    console.log(chalk.bold.cyan('='.repeat(70)));
    console.log(chalk.yellow(`🎯 Target: ${this.domain}`));
    console.log(chalk.gray(`⚙️  Concurrent requests: ${this.options.concurrentLimit}`));
    console.log(chalk.gray(`⚙️  Deep scan: ${this.options.deepScan ? 'Enabled' : 'Disabled'}`));
    console.log(chalk.gray(`⚙️  Subdomain scan: ${this.options.subdomainScan ? 'Enabled' : 'Disabled'}`));
    console.log(chalk.gray(`⚙️  Port scan: ${this.options.portScan ? 'Enabled' : 'Disabled'}`));
    console.log(chalk.bold.cyan('='.repeat(70)));

    await this.crawlHomepage();
    await this.scanSitemap();
    await this.scanRobotsTxt();
    await this.scanCommonPaths();
    
    if (this.options.subdomainScan) {
      await this.scanSubdomains();
    }
    
    if (this.options.portScan) {
      await this.scanPorts();
    }
    
    if (this.options.deepScan) {
      await this.recursiveScan(0);
    }

    const duration = Math.round((Date.now() - this.stats.startTime) / 1000);

    console.log(chalk.bold.cyan('\n' + '='.repeat(70)));
    console.log(chalk.bold.green('✅ DISCOVERY COMPLETE'));
    console.log(chalk.bold.cyan('='.repeat(70)));
    console.log(chalk.yellow(`📊 Total WSDL endpoints found: ${this.stats.wsdlFound}`));
    console.log(chalk.gray(`🔍 URLs scanned: ${this.stats.urlsScanned}`));
    console.log(chalk.gray(`🌐 Subdomains checked: ${this.stats.subdomainsChecked}`));
    console.log(chalk.gray(`⏱️  Duration: ${duration}s`));
    console.log(chalk.bold.cyan('='.repeat(70) + '\n'));

    return this.results;
  }

  // Save results to JSON file
  async saveResults(filename = 'wsdl-discovery-results.json') {
    const output = {
      domain: this.domain,
      timestamp: new Date().toISOString(),
      scanDuration: Math.round((Date.now() - this.stats.startTime) / 1000),
      statistics: {
        totalEndpoints: this.results.length,
        urlsScanned: this.stats.urlsScanned,
        subdomainsChecked: this.stats.subdomainsChecked,
        portsScanned: this.stats.portsScanned,
      },
      configuration: {
        deepScan: this.options.deepScan,
        subdomainScan: this.options.subdomainScan,
        portScan: this.options.portScan,
        concurrentLimit: this.options.concurrentLimit,
      },
      endpoints: this.results,
    };

    await fs.writeFile(filename, JSON.stringify(output, null, 2));
    console.log(chalk.green(`💾 Results saved to: ${filename}`));
  }
}

// Main function
async function main() {
  console.log(chalk.bold.cyan('=' + '='.repeat(70) + '='));
  console.log(chalk.bold.white('    🔥 ULTIMATE WSDL ENDPOINT DISCOVERY TOOL 🔥'));
  console.log(chalk.bold.cyan('=' + '='.repeat(70) + '='));
  console.log(chalk.yellow('\n✨ The Most Powerful WSDL Scanner Available ✨\n'));
  console.log(chalk.gray('Features:'));
  console.log(chalk.gray('  • Multiple discovery methods'));
  console.log(chalk.gray('  • Subdomain enumeration'));
  console.log(chalk.gray('  • Port scanning'));
  console.log(chalk.gray('  • Recursive deep scanning'));
  console.log(chalk.gray('  • Concurrent requests for speed'));
  console.log(chalk.gray('  • Detailed service analysis'));
  console.log(chalk.gray('  • HTML & JSON reports\n'));
  console.log(chalk.red('⚠️  IMPORTANT: Only scan domains you own or have permission to test.\n'));

  try {
    while (true) {
      const domain = await question(chalk.cyan('Enter domain to scan (or "exit" to quit): '));
      
      if (domain.toLowerCase() === 'exit' || domain.toLowerCase() === 'quit') {
        console.log(chalk.yellow('\nGoodbye! 👋'));
        break;
      }

      if (!domain || domain.trim() === '') {
        console.log(chalk.red('❌ Please enter a valid domain name\n'));
        continue;
      }

      // Ask for scan options
      const deepScan = await question(chalk.cyan('Enable deep scanning? (yes/no) [yes]: '));
      const subdomainScan = await question(chalk.cyan('Enable subdomain scanning? (yes/no) [yes]: '));
      const portScan = await question(chalk.cyan('Enable port scanning? (yes/no) [no]: '));

      const options = {
        deepScan: deepScan.toLowerCase() !== 'no',
        subdomainScan: subdomainScan.toLowerCase() !== 'no',
        portScan: portScan.toLowerCase() === 'yes' || portScan.toLowerCase() === 'y',
      };

      // Create discovery instance and run
      const discovery = new PowerfulWSDLDiscovery(domain, options);
      const results = await discovery.discover();

      // Display summary
      if (results.length > 0) {
        console.log(chalk.bold.yellow('\n📋 DETAILED SUMMARY:\n'));
        results.forEach((result, index) => {
          console.log(chalk.cyan(`${index + 1}. ${result.url}`));
          console.log(chalk.gray(`   Method: ${result.discoveryMethod} | Response: ${result.responseTime}ms`));
          if (result.services.length > 0) {
            result.services.forEach(svc => {
              console.log(chalk.yellow(`   📦 Service: ${svc.name}`));
              if (svc.operations.length > 0) {
                console.log(chalk.gray(`   🔧 Operations: ${svc.operations.map(o => o.name).slice(0, 5).join(', ')}${svc.operations.length > 5 ? '...' : ''}`));
              }
            });
          }
          console.log('');
        });

        // Ask if user wants to save results
        const saveJSON = await question(chalk.cyan('Save results to JSON file? (yes/no): '));
        if (saveJSON.toLowerCase() === 'yes' || saveJSON.toLowerCase() === 'y') {
          await discovery.saveResults(`wsdl-results-${domain.replace(/\./g, '-')}.json`);
        }

        const saveHTML = await question(chalk.cyan('Generate HTML report? (yes/no): '));
        if (saveHTML.toLowerCase() === 'yes' || saveHTML.toLowerCase() === 'y') {
          await discovery.generateHTMLReport(`wsdl-report-${domain.replace(/\./g, '-')}.html`);
        }
      } else {
        console.log(chalk.red('\n❌ No WSDL endpoints found on this domain.'));
        console.log(chalk.gray('   Possible reasons:'));
        console.log(chalk.gray('   • The domain does not expose SOAP web services'));
        console.log(chalk.gray('   • WSDL endpoints use non-standard paths'));
        console.log(chalk.gray('   • Services are protected by authentication'));
        console.log(chalk.gray('   • The domain is not accessible\n'));
      }

      const continueChoice = await question(chalk.cyan('Scan another domain? (yes/no): '));
      if (continueChoice.toLowerCase() !== 'yes' && continueChoice.toLowerCase() !== 'y') {
        console.log(chalk.yellow('\nGoodbye! 👋'));
        break;
      }
      console.log('\n');
    }
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
  } finally {
    rl.close();
  }
}

// Run the application
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  });
}

module.exports = { PowerfulWSDLDiscovery };
