const { PowerfulWSDLDiscovery } = require('./index.js');

console.log('='.repeat(70));
console.log('🔥 DEMO: WSDL DISCOVERY TOOL v2.0');
console.log('='.repeat(70));
console.log('\n📋 Ini adalah demonstrasi tool WSDL Discovery\n');

async function demo() {
  console.log('✨ Fitur-fitur yang tersedia:');
  console.log('  • Homepage crawling');
  console.log('  • Sitemap.xml parsing');
  console.log('  • Robots.txt analysis');
  console.log('  • Common path scanning (40+ paths)');
  console.log('  • Subdomain enumeration (20+ subdomains)');
  console.log('  • Port scanning (12 ports)');
  console.log('  • Recursive deep scanning (3 levels)');
  console.log('  • Concurrent requests (10x faster)\n');

  console.log('📊 Contoh penggunaan tool:\n');
  
  console.log('1. Buat instance scanner:');
  console.log('   const discovery = new PowerfulWSDLDiscovery("example.com", {');
  console.log('     deepScan: true,');
  console.log('     subdomainScan: true,');
  console.log('     portScan: false');
  console.log('   });\n');

  console.log('2. Jalankan scanning:');
  console.log('   const results = await discovery.discover();\n');

  console.log('3. Simpan hasil:');
  console.log('   await discovery.saveResults("hasil.json");');
  console.log('   await discovery.generateHTMLReport("report.html");\n');

  console.log('='.repeat(70));
  console.log('📖 Contoh Output Ketika Menemukan Endpoint:');
  console.log('='.repeat(70));
  console.log('');
  console.log('✅ Found: https://example.com/services/UserService?wsdl');
  console.log('   📦 Service: UserService');
  console.log('   🔧 Operations: getUser, createUser, updateUser, deleteUser');
  console.log('   ⏱️  Response Time: 234ms');
  console.log('   💾 Size: 15KB');
  console.log('   🖥️  Server: Apache\n');

  console.log('✅ Found: https://api.example.com/soap/AuthService?wsdl');
  console.log('   📦 Service: AuthenticationService');
  console.log('   🔧 Operations: login, logout, validateToken, refreshToken');
  console.log('   ⏱️  Response Time: 187ms');
  console.log('   💾 Size: 22KB');
  console.log('   🖥️  Server: nginx\n');

  console.log('='.repeat(70));
  console.log('📊 Statistik Akhir:');
  console.log('='.repeat(70));
  console.log('');
  console.log('✅ Total WSDL endpoints found: 2');
  console.log('🔍 URLs scanned: 847');
  console.log('🌐 Subdomains checked: 20');
  console.log('⏱️  Duration: 45s');
  console.log('');

  console.log('='.repeat(70));
  console.log('💾 Export Options:');
  console.log('='.repeat(70));
  console.log('');
  console.log('JSON File (hasil.json):');
  console.log('{');
  console.log('  "domain": "example.com",');
  console.log('  "timestamp": "2026-01-01T21:56:00.000Z",');
  console.log('  "totalEndpoints": 2,');
  console.log('  "endpoints": [...]');
  console.log('}\n');

  console.log('HTML Report (report.html):');
  console.log('✓ Professional dashboard dengan statistik visual');
  console.log('✓ Color-coded endpoints');
  console.log('✓ Service details dan operations');
  console.log('✓ Performance metrics');
  console.log('✓ Responsive design\n');

  console.log('='.repeat(70));
  console.log('🚀 Cara Menjalankan Tool Secara Interaktif:');
  console.log('='.repeat(70));
  console.log('');
  console.log('$ npm start\n');
  console.log('Tool akan menampilkan:');
  console.log('  1. Prompt untuk input domain');
  console.log('  2. Pilihan opsi scanning (deep, subdomain, port)');
  console.log('  3. Progress scanning real-time dengan warna');
  console.log('  4. Hasil endpoint yang ditemukan');
  console.log('  5. Opsi untuk save JSON atau generate HTML report\n');

  console.log('='.repeat(70));
  console.log('✅ Tool sudah siap digunakan!');
  console.log('='.repeat(70));
  console.log('\nPetunjuk lengkap ada di:');
  console.log('  • README.md (English)');
  console.log('  • README.id.md (Bahasa Indonesia)\n');
}

demo().catch(error => {
  console.error('Error:', error.message);
});
