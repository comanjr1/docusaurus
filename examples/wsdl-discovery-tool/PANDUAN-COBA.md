# 🚀 PANDUAN COBA PROJECT - WSDL Discovery Tool v2.0

## Langkah 1: Persiapan

Pastikan Anda sudah berada di direktori project:

```bash
cd examples/wsdl-discovery-tool
```

## Langkah 2: Install Dependencies

```bash
npm install
```

Output yang diharapkan:
```
added 63 packages, and audited 64 packages in 3s
found 0 vulnerabilities
```

## Langkah 3: Coba Demo Tool

### A. Demo Fitur (Tanpa Scanning Aktual)

Lihat demonstrasi fitur-fitur tool:

```bash
node demo.js
```

Ini akan menampilkan:
- Daftar semua fitur
- Contoh penggunaan programmatic
- Contoh output ketika menemukan endpoint
- Format export (JSON & HTML)

### B. Test Setup Tool

Verifikasi bahwa tool berfungsi dengan baik:

```bash
node test-setup.js
```

Output yang diharapkan:
- ✅ Test 1: Scanner instance created
- ✅ Test 2: Configuration check
- ✅ Test 3: All methods available
- ✅ Test 4: Statistics tracking
- ✅ ALL TESTS PASSED!

### C. Jalankan Tool Interaktif

**PERINGATAN**: Hanya gunakan pada domain yang Anda miliki!

```bash
npm start
```

Anda akan diminta:

1. **Masukkan domain:**
   ```
   Enter domain to scan: example.com
   ```

2. **Pilih opsi Deep Scanning:**
   ```
   Enable deep scanning? (yes/no) [yes]: yes
   ```
   - Ketik `yes` untuk scanning lebih menyeluruh
   - Ketik `no` untuk scanning dasar saja

3. **Pilih opsi Subdomain Scanning:**
   ```
   Enable subdomain scanning? (yes/no) [yes]: yes
   ```
   - Ketik `yes` untuk scan 20+ subdomain
   - Ketik `no` untuk skip subdomain scanning

4. **Pilih opsi Port Scanning:**
   ```
   Enable port scanning? (yes/no) [no]: no
   ```
   - Ketik `yes` untuk scan 12 port (lebih lambat)
   - Ketik `no` untuk skip port scanning (disarankan)

### D. Contoh Output Saat Scanning

```
======================================================================
🚀 POWERFUL WSDL DISCOVERY TOOL v2.0
======================================================================
🎯 Target: example.com
⚙️  Concurrent requests: 10
⚙️  Deep scan: Enabled
⚙️  Subdomain scan: Enabled
⚙️  Port scan: Disabled
======================================================================

🏠 Crawling homepage for WSDL links...
🗺️  Scanning sitemap.xml...
🤖 Scanning robots.txt...
🔍 Scanning common paths and patterns...

✅ Found: https://example.com/services/UserService?wsdl
   📦 Service: UserService
   🔧 Operations: getUser, createUser, updateUser

🌐 Scanning subdomains...

✅ DISCOVERY COMPLETE
======================================================================
📊 Total WSDL endpoints found: 1
🔍 URLs scanned: 234
🌐 Subdomains checked: 20
⏱️  Duration: 15s
======================================================================
```

## Langkah 4: Export Hasil

Setelah scanning selesai, Anda akan ditanya:

### Save JSON?
```
Save results to JSON file? (yes/no): yes
```
Hasil akan disimpan sebagai: `wsdl-results-example-com.json`

### Generate HTML Report?
```
Generate HTML report? (yes/no): yes
```
Hasil akan disimpan sebagai: `wsdl-report-example-com.html`

Buka file HTML di browser untuk melihat report profesional dengan:
- Dashboard statistik visual
- Daftar endpoint dengan warna
- Detail service dan operations
- Metrics performa

## Langkah 5: Penggunaan Programmatic (Opsional)

Buat file JavaScript baru, misalnya `my-scan.js`:

```javascript
const { PowerfulWSDLDiscovery } = require('./index.js');

async function scanMyDomain() {
  // Buat instance scanner
  const discovery = new PowerfulWSDLDiscovery('example.com', {
    deepScan: true,
    subdomainScan: true,
    portScan: false,
    concurrentLimit: 10,
  });
  
  // Jalankan scanning
  console.log('Memulai scanning...');
  const results = await discovery.discover();
  
  // Tampilkan hasil
  console.log(`\nDitemukan ${results.length} endpoint WSDL`);
  
  // Simpan hasil
  if (results.length > 0) {
    await discovery.saveResults('hasil-scan.json');
    await discovery.generateHTMLReport('laporan-scan.html');
    console.log('\n✅ Hasil telah disimpan!');
  }
}

// Jalankan
scanMyDomain().catch(error => {
  console.error('Error:', error.message);
});
```

Jalankan dengan:
```bash
node my-scan.js
```

## 📖 Tips Penggunaan

### Untuk Domain Kecil:
```javascript
{
  deepScan: false,
  subdomainScan: false,
  portScan: false
}
```
- Scanning cepat (5-10 detik)
- Coverage dasar

### Untuk Domain Menengah (Recommended):
```javascript
{
  deepScan: true,
  subdomainScan: true,
  portScan: false
}
```
- Scanning menyeluruh (30-60 detik)
- Coverage maksimal tanpa port scanning

### Untuk Domain Besar (Advanced):
```javascript
{
  deepScan: true,
  subdomainScan: true,
  portScan: true,
  concurrentLimit: 15
}
```
- Scanning sangat menyeluruh (2-5 menit)
- Coverage maksimal termasuk port scanning

## ⚠️ Peringatan Penting

**HANYA gunakan tool ini pada:**
- Domain yang Anda miliki
- Domain yang Anda punya izin tertulis untuk test
- Sesuai hukum dan regulasi setempat

**JANGAN gunakan untuk:**
- Domain orang lain tanpa izin
- Aktivitas ilegal
- Melanggar terms of service

## 📚 Dokumentasi Lengkap

- **README.md** - Dokumentasi lengkap dalam Bahasa Inggris
- **README.id.md** - Dokumentasi lengkap dalam Bahasa Indonesia

## 🆘 Troubleshooting

### Error: "Cannot find module"
**Solusi:** Jalankan `npm install` terlebih dahulu

### Error: "ECONNREFUSED" atau timeout
**Solusi:** 
- Cek koneksi internet
- Domain mungkin tidak accessible
- Coba kurangi `concurrentLimit`

### Tidak menemukan endpoint
**Solusi:**
- Enable deep scan dan subdomain scan
- Domain mungkin tidak punya SOAP services
- Coba domain yang berbeda

### Scanning terlalu lambat
**Solusi:**
- Disable port scanning
- Kurangi recursive depth
- Tingkatkan concurrentLimit (hati-hati dengan server load)

## ✅ Selesai!

Tool sudah siap digunakan. Selamat mencoba! 🚀
