# WSDL Discovery Tool - Panduan Penggunaan (Bahasa Indonesia)

## Deskripsi

Tool ini adalah alat yang powerful untuk menemukan endpoint WSDL dari domain yang Anda target. Tool ini akan melakukan scanning secara otomatis untuk menemukan semua SOAP web service yang tersedia.

## Cara Instalasi

1. Masuk ke direktori tool:
```bash
cd examples/wsdl-discovery-tool
```

2. Install dependensi:
```bash
npm install
```

## Cara Menggunakan

### Metode 1: Mode Interaktif

Jalankan tool secara interaktif:

```bash
npm start
```

Kemudian masukkan domain yang ingin Anda scan ketika diminta.

### Metode 2: Menggunakan Contoh

Jalankan file example untuk testing:

```bash
node example.js
```

### Metode 3: Programmatic Usage

Anda juga bisa menggunakan tool ini dalam kode JavaScript Anda sendiri:

```javascript
const { WSDLDiscovery } = require('./index.js');

async function scanDomain() {
  const discovery = new WSDLDiscovery('example.com');
  const results = await discovery.discover();
  
  console.log(`Ditemukan ${results.length} endpoint WSDL`);
  
  // Simpan hasil ke file
  await discovery.saveResults('hasil-scan.json');
}

scanDomain();
```

## Fitur Scanning

Tool ini menggunakan beberapa metode untuk menemukan endpoint WSDL:

1. **Homepage Crawling** - Mencari link WSDL di halaman utama website
2. **Sitemap Scanning** - Memeriksa sitemap.xml untuk referensi WSDL
3. **Robots.txt Analysis** - Menganalisis robots.txt untuk path service
4. **Common Path Scanning** - Memeriksa path-path umum seperti:
   - `/services/`
   - `/webservices/`
   - `/api/`
   - `/soap/`
   - `/ws/`

## Contoh Output

```
🎯 Starting WSDL Discovery for: example.com

🏠 Crawling homepage for WSDL links...
🗺️  Checking sitemap.xml...
🤖 Checking robots.txt...
🔍 Scanning common paths...

✅ Found: https://example.com/services/UserService?wsdl
   Service: UserService
   Operations: getUser, createUser, updateUser, deleteUser

✅ Found: https://example.com/api/PaymentService?wsdl
   Service: PaymentService
   Operations: processPayment, refund, getPaymentStatus

📊 Discovery Complete
Total WSDL endpoints found: 2
```

## Hasil Scan

Hasil scan bisa disimpan dalam format JSON dengan struktur seperti ini:

```json
{
  "domain": "example.com",
  "timestamp": "2025-12-31T12:00:00.000Z",
  "totalEndpoints": 2,
  "endpoints": [
    {
      "url": "https://example.com/services/UserService?wsdl",
      "services": [
        {
          "name": "UserService",
          "operations": ["getUser", "createUser", "updateUser"]
        }
      ],
      "discoveryMethod": "common-path-scan"
    }
  ]
}
```

## Catatan Penting

⚠️ **PENTING**: Hanya gunakan tool ini pada domain yang Anda miliki atau yang Anda memiliki izin untuk scan. Scanning tanpa izin dapat melanggar terms of service dan hukum setempat.

## Tips Penggunaan

- Pastikan Anda memiliki koneksi internet yang stabil
- Scanning bisa memakan waktu beberapa menit tergantung ukuran website
- Hasil scan akan lebih baik jika website menggunakan konvensi penamaan standar untuk web services
- Gunakan hasil scan dengan bijak dan bertanggung jawab

## Troubleshooting

**Q: Tool tidak menemukan endpoint WSDL padahal saya yakin ada?**
- A: Coba gunakan HTTPS dan HTTP (tool akan mencoba keduanya)
- Pastikan endpoint tidak dilindungi dengan authentication
- Beberapa website mungkin menggunakan path non-standar

**Q: Error timeout saat scanning?**
- A: Website mungkin lambat atau tidak accessible. Coba lagi nanti atau periksa koneksi internet Anda.

## Lisensi

MIT
