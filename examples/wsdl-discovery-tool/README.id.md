# 🔥 ULTIMATE WSDL Discovery Tool v2.0 - Tool Paling Powerful!

**Tool pencarian endpoint WSDL (Web Services Description Language) paling lengkap dan powerful yang tersedia!**

## 🚀 Kenapa Ini Yang Paling Powerful?

Ini bukan sekedar scanner WSDL biasa - ini adalah **suite reconnaissance lengkap** untuk SOAP web services dengan fitur-fitur canggih yang jauh melampaui scanning dasar:

### 💪 Fitur-Fitur Canggih

1. **🔍 Multiple Discovery Methods (7+ Metode)**:
   - Homepage crawling untuk mencari link WSDL
   - Sitemap.xml deep parsing
   - Analisis Robots.txt
   - Scanning path umum dengan 40+ pattern
   - Intelligent endpoint guessing berbasis pattern

2. **🌐 Subdomain Enumeration (Pencarian Subdomain)**:
   - Otomatis scan 20+ subdomain umum (api, ws, services, soap, dll)
   - Test path web service di setiap subdomain yang ditemukan
   - Identifikasi endpoint API tersembunyi

3. **🔌 Port Scanning (Opsional)**:
   - Scan port web service umum (8080, 8443, 9080, 9443, dll)
   - Identifikasi service yang berjalan di port non-standard
   - Coverage lengkap untuk environment enterprise

4. **🔎 Recursive Deep Scanning**:
   - Penelusuran direktori multi-level
   - Menemukan hierarki service bertingkat
   - Kedalaman scan bisa dikonfigurasi (hingga 3 level)

5. **⚡ High-Performance Concurrent Scanning**:
   - Processing request paralel (10 concurrent default)
   - Smart rate limiting untuk menghindari overwhelm server
   - 10x lebih cepat dari sequential scanning

6. **📊 Analisis Service Komprehensif**:
   - Ekstrak nama service, namespace, dan operasi
   - Identifikasi SOAP binding types dan transport protocols
   - Parse konfigurasi port dan endpoint
   - Ekstraksi dokumentasi operasi

7. **📈 Real-Time Metrics**:
   - Pengukuran response time untuk setiap endpoint
   - Tracking ukuran content
   - Identifikasi server
   - Statistik dan progress tracking

8. **📄 Multiple Export Formats**:
   - **JSON**: Data terstruktur untuk penggunaan programmatic
   - **HTML**: Report profesional dengan statistik dan visualisasi
   - Informasi endpoint detail dengan hasil color-coded

## Instalasi

```bash
npm install
```

## Cara Penggunaan

### Mode Interaktif (Recommended)

```bash
npm start
```

Anda akan diminta untuk:
1. Masukkan domain target
2. Pilih opsi scanning:
   - Deep scanning (disarankan: yes)
   - Subdomain scanning (disarankan: yes)
   - Port scanning (opsional: gunakan dengan hati-hati)

### Contoh Sesi Scanning

```
Enter domain to scan: example.com
Enable deep scanning? (yes/no) [yes]: yes
Enable subdomain scanning? (yes/no) [yes]: yes
Enable port scanning? (yes/no) [no]: no

🚀 POWERFUL WSDL DISCOVERY TOOL v2.0
🎯 Target: example.com
⚙️  Concurrent requests: 10
⚙️  Deep scan: Enabled
⚙️  Subdomain scan: Enabled

🏠 Crawling homepage for WSDL links...
✅ Found: https://example.com/services/UserService?wsdl
   📦 Service: UserService
   🔧 Operations: getUser, createUser, updateUser, deleteUser

🗺️  Scanning sitemap.xml...
🤖 Scanning robots.txt...
🔍 Scanning common paths and patterns...
✅ Found: https://example.com/api/PaymentService?wsdl
   📦 Service: PaymentService
   🔧 Operations: processPayment, refund, getStatus

🌐 Scanning subdomains...
   Found active subdomain: api.example.com
   ✅ Found on subdomain: https://api.example.com/services/AuthService?wsdl

✅ DISCOVERY COMPLETE
📊 Total WSDL endpoints found: 3
🔍 URLs scanned: 847
🌐 Subdomains checked: 20
⏱️  Duration: 45s
```

### Penggunaan Programmatic

```javascript
const { PowerfulWSDLDiscovery } = require('./index.js');

async function scanDomain() {
  const discovery = new PowerfulWSDLDiscovery('example.com', {
    deepScan: true,
    subdomainScan: true,
    portScan: false,
    concurrentLimit: 15, // Scanning lebih agresif
    recursiveDepth: 3,
  });
  
  const results = await discovery.discover();
  
  console.log(`Ditemukan ${results.length} endpoint WSDL`);
  
  // Simpan hasil
  await discovery.saveResults('results.json');
  await discovery.generateHTMLReport('report.html');
}

scanDomain();
```

## 🎯 Metode Discovery Explained

### 1. Homepage Crawling
Menganalisis HTML website utama untuk menemukan link langsung ke file WSDL atau service endpoint.

### 2. Sitemap Scanning
Mem-parse XML sitemap (sitemap.xml, sitemap_index.xml) untuk menemukan URL service.

### 3. Robots.txt Analysis
Mengekstrak path disallowed/allowed yang mungkin berisi web services.

### 4. Common Path Scanning
Test 40+ path web service umum termasuk:
- `/services/`, `/webservices/`, `/api/`, `/soap/`, `/ws/`
- `/axis/`, `/axis2/`, `/cxf/`, `/jaxws/`
- Path spesifik framework untuk framework SOAP populer

### 5. Subdomain Enumeration
Cek subdomain umum: api, ws, webservices, services, soap, dev, test, staging, prod, dll.

### 6. Port Scanning (Opsional)
Test port web service umum: 8080, 8443, 9080, 9443, 8081, 8082, 8888, 9090, 7080, 7443

### 7. Recursive Deep Scan
Eksplorasi path yang ditemukan untuk mencari nested services dan hidden endpoints.

## 📊 Contoh Output

### Output Console
Progress real-time dengan color-coded, emoji dan indikator status.

### Export JSON
```json
{
  "domain": "example.com",
  "timestamp": "2025-12-31T18:00:00.000Z",
  "scanDuration": 45,
  "statistics": {
    "totalEndpoints": 3,
    "urlsScanned": 847,
    "subdomainsChecked": 20,
    "portsScanned": 0
  },
  "endpoints": [
    {
      "url": "https://example.com/services/UserService?wsdl",
      "services": [...],
      "discoveryMethod": "common-path-scan",
      "responseTime": 234,
      "contentLength": 15678,
      "server": "Apache"
    }
  ]
}
```

### HTML Report
Report HTML profesional dan interaktif dengan:
- Dashboard statistik visual
- Endpoint dengan color-coded
- Detail service dan operasi
- Metrik performa
- Responsive design

## ⚙️ Opsi Konfigurasi

```javascript
{
  timeout: 15000,           // Request timeout dalam ms
  maxRedirects: 5,          // Max HTTP redirects
  concurrentLimit: 10,      // Request paralel
  deepScan: true,           // Enable recursive scanning
  subdomainScan: true,      // Enable subdomain enumeration
  portScan: false,          // Enable port scanning
  recursiveDepth: 3,        // Max kedalaman rekursi
}
```

## 🔒 Keamanan & Etika

**⚠️ PERINGATAN PENTING**: Ini adalah tool reconnaissance yang powerful. **HANYA** gunakan pada:
- Domain yang Anda miliki
- Sistem yang Anda punya izin tertulis eksplisit untuk test
- Sesuai dengan hukum dan regulasi setempat

**Panduan Penggunaan Bertanggung Jawab**:
- Hormati rate limit dan resource server
- Gunakan setting concurrency yang sesuai
- Jangan gunakan untuk tujuan jahat
- Ikuti praktik responsible disclosure untuk temuan
- Sadari bahwa scanning bisa di-log dan terdeteksi

## 🚀 Performa

- **Kecepatan**: 10x lebih cepat dari scanner basic melalui concurrent requests
- **Efisiensi**: Smart caching mencegah duplicate requests
- **Coverage**: Test 1000+ kombinasi endpoint potensial
- **Skalabilitas**: Handle deployment skala enterprise

## 🆚 Perbandingan dengan Tool Basic

| Fitur | Tool Basic | Tool Ini |
|-------|-----------|----------|
| Metode Discovery | 1-2 | 7+ |
| Subdomain Scanning | ❌ | ✅ |
| Port Scanning | ❌ | ✅ |
| Concurrent Requests | ❌ | ✅ |
| Deep Scanning | ❌ | ✅ |
| HTML Reports | ❌ | ✅ |
| Analisis Service | Basic | Komprehensif |
| Metrik Performa | ❌ | ✅ |
| Kecepatan | Lambat | 10x Lebih Cepat |

## 📝 Tips Untuk Hasil Terbaik

1. **Mulai dengan deep scan enabled** - Menemukan endpoint paling banyak
2. **Enable subdomain scanning** - Sering mengungkap hidden services
3. **Gunakan port scanning dengan hati-hati** - Bisa noisy dan memakan waktu
4. **Simpan JSON dan HTML** - JSON untuk automation, HTML untuk review
5. **Cek HTML report** - Lebih mudah untuk review visual
6. **Jalankan saat jam kerja** - Kemungkinan lebih besar service aktif
7. **Bersabar dengan domain besar** - Scan komprehensif butuh waktu

## 🐛 Troubleshooting

**Q: Scan sangat lambat?**
- A: Tingkatkan `concurrentLimit` (tapi tetap hormati server)
- Disable port scanning jika tidak diperlukan
- Kurangi `recursiveDepth`

**Q: Tidak menemukan endpoint?**
- A: Service mungkin menggunakan authentication
- Coba subdomain dan deep scanning
- Cek apakah service menggunakan path non-standard
- Domain mungkin tidak expose SOAP services

**Q: Terlalu banyak false positive?**
- A: Tool memvalidasi struktur WSDL - false positive jarang
- Cek XML untuk konfirmasi valid WSDL

## 📄 Lisensi

MIT

---

**Dibuat dengan 🔥 untuk security researcher, penetration tester, dan system administrator**
