const { WSDLDiscovery } = require('./index.js');

// Example: Testing WSDL discovery programmatically
async function testDiscovery() {
  console.log('Testing WSDL Discovery Tool\n');
  
  // Example domain (you can replace with your own domain)
  const testDomain = 'www.dneonline.com'; // Known to have WSDL examples
  
  console.log(`Testing with domain: ${testDomain}\n`);
  
  const discovery = new WSDLDiscovery(testDomain);
  const results = await discovery.discover();
  
  console.log(`\n✅ Test completed!`);
  console.log(`Found ${results.length} WSDL endpoint(s)\n`);
  
  if (results.length > 0) {
    console.log('Sample endpoint:');
    console.log(JSON.stringify(results[0], null, 2));
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testDiscovery().catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });
}
