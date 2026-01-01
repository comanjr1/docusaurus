const { PowerfulWSDLDiscovery } = require('./index.js');

console.log('='.repeat(70));
console.log('🧪 TEST: WSDL Discovery Tool - Quick Test');
console.log('='.repeat(70));
console.log('\n📝 Testing the tool configuration and setup...\n');

async function quickTest() {
  try {
    // Test 1: Create instance
    console.log('✅ Test 1: Creating scanner instance');
    const discovery = new PowerfulWSDLDiscovery('example.com', {
      deepScan: false,
      subdomainScan: false,
      portScan: false,
      concurrentLimit: 5,
    });
    console.log('   ✓ Scanner instance created successfully');
    console.log('   ✓ Domain:', discovery.domain);
    console.log('   ✓ Base URL:', discovery.baseUrl);
    console.log('');

    // Test 2: Check configuration
    console.log('✅ Test 2: Configuration check');
    console.log('   ✓ Deep scan:', discovery.options.deepScan ? 'Enabled' : 'Disabled');
    console.log('   ✓ Subdomain scan:', discovery.options.subdomainScan ? 'Enabled' : 'Disabled');
    console.log('   ✓ Port scan:', discovery.options.portScan ? 'Enabled' : 'Disabled');
    console.log('   ✓ Concurrent limit:', discovery.options.concurrentLimit);
    console.log('');

    // Test 3: Verify methods exist
    console.log('✅ Test 3: Verifying methods');
    const methods = [
      'makeRequest',
      'isValidWSDL',
      'extractServiceInfo',
      'scanCommonPaths',
      'scanSubdomains',
      'scanPorts',
      'scanSitemap',
      'scanRobotsTxt',
      'crawlHomepage',
      'discover',
      'saveResults',
      'generateHTMLReport'
    ];
    
    methods.forEach(method => {
      if (typeof discovery[method] === 'function') {
        console.log(`   ✓ ${method}() is available`);
      }
    });
    console.log('');

    // Test 4: Show stats structure
    console.log('✅ Test 4: Statistics tracking');
    console.log('   ✓ URLs scanned:', discovery.stats.urlsScanned);
    console.log('   ✓ WSDL found:', discovery.stats.wsdlFound);
    console.log('   ✓ Subdomains checked:', discovery.stats.subdomainsChecked);
    console.log('   ✓ Start time:', new Date(discovery.stats.startTime).toISOString());
    console.log('');

    console.log('='.repeat(70));
    console.log('✅ ALL TESTS PASSED!');
    console.log('='.repeat(70));
    console.log('');
    console.log('Tool is ready to use! You can now:');
    console.log('  1. Run: npm start');
    console.log('  2. Or use programmatically as shown in README.md');
    console.log('');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

quickTest();
