# WebGIS Pariwisata Kabupaten Pemalang 🌍

Sistem Informasi Geografis Pariwisata Berbasis Web dengan Fitur Rekomendasi Destinasi Terdekat menggunakan **Algoritma Haversine**. Studi kasus: Kabupaten Pemalang.

Aplikasi ini dikembangkan untuk memvisualisasikan 25 destinasi wisata unggulan dan memberikan rekomendasi lokasi terdekat secara akurat kepada wisatawan.

---

## 🚀 Teknologi & Infrastruktur (Deployment)

Proyek ini telah dikonfigurasi untuk siap di-*deploy* ke *production* menggunakan *stack* berikut:

- **Frontend Hosting**: [Vercel](https://vercel.com) (React.js + Vite + Tailwind CSS + Leaflet.js)
- **Backend Hosting**: [Render](https://render.com) (Node.js + Express.js + REST API)
- **Database Hosting**: [Neon Serverless Postgres](https://neon.tech) (PostgreSQL dengan ekstensi PostGIS)
- **Image Storage**: [Cloudinary](https://cloudinary.com) (Penyimpanan aset foto dan galeri)

---

## ✨ Fitur Utama

1. **Peta Digital Interaktif (WebGIS)**: Memvisualisasikan sebaran destinasi wisata menggunakan pustaka Leaflet.js yang responsif dan informatif.
2. **Algoritma Haversine (Rekomendasi Terdekat)**: Sistem mampu membaca koordinat pengguna secara otomatis (Geolocation API) atau manual, kemudian menghitung jarak garis lurus (*Great-Circle Distance*) ke seluruh destinasi wisata secara presisi.
3. **Pencarian & Filter Pintar**: Pencarian destinasi berdasarkan nama secara *real-time* dan penyaringan berdasarkan kategori wisata (Alam, Bahari, Buatan, Religi).
4. **Integrasi Panduan Rute**: Menggambar estimasi rute pada peta dan terhubung secara transparan dengan Google Maps untuk navigasi berkendara.
5. **Dashboard Administrator (CMS)**: Halaman khusus Admin untuk melakukan operasi CRUD (Create, Read, Update, Delete) data wisata, harga tiket, jam operasional, hingga fasilitas pendukung.
6. **Keamanan Data**: Menggunakan JWT (*JSON Web Token*) untuk sesi dan *Bcrypt* untuk *hashing* kata sandi.

---

## 📁 Struktur Direktori

```text
📦 WebGIS Pemalang
 ┣ 📂 backend/         # Server Node.js / Express
 ┃ ┣ 📂 config/        # Konfigurasi database & Cloudinary
 ┃ ┣ 📂 controllers/   # Logika bisnis (CRUD)
 ┃ ┣ 📂 middleware/    # Auth middleware (Validasi JWT & Admin Role)
 ┃ ┣ 📂 routes/        # Definisi Endpoint API
 ┃ ┣ 📂 utils/         # Fungsi Helper Pembantu
 ┃ ┃ ┗ 📜 haversine.js # Logika Algoritma Haversine
 ┃ ┗ 📜 server.js      # Entry point backend
 ┣ 📂 frontend/        # Aplikasi Client-side React.js
 ┃ ┣ 📂 public/        # Aset statis (ikon, video background)
 ┃ ┣ 📂 src/           # Source code React (Komponen, Halaman, Services)
 ┃ ┗ 📜 vite.config.js # Konfigurasi build & PWA
 ┗ 📜 README.md
```

---

## 💻 Panduan Instalasi Lokal (Development)

Jika Anda ingin menjalankan proyek ini secara lokal (di komputer sendiri), ikuti langkah-langkah berikut:

### 1. Persiapan
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (Versi 16 atau lebih baru)
- [PostgreSQL](https://www.postgresql.org/) dengan ekstensi **PostGIS** aktif
- Akun Cloudinary (Dapatkan API Key, API Secret, dan Cloud Name)

### 2. Setup Database (Neon / Lokal PostgreSQL)
Buat database bernama `pemalang_gis` lalu jalankan *query* ekstensi PostGIS:
```sql
CREATE EXTENSION postgis;
```

### 3. Konfigurasi Backend
1. Buka terminal, masuk ke folder backend: `cd backend`
2. Instal dependensi: `npm install`
3. Buat file `.env` di dalam folder backend, isi dengan konfigurasi berikut:
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=password_db_kamu
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pemalang_gis

JWT_SECRET=rahasia_aman_skripsi

CLOUDINARY_CLOUD_NAME=nama_cloud_kamu
CLOUDINARY_API_KEY=api_key_kamu
CLOUDINARY_API_SECRET=api_secret_kamu
```
4. Jalankan server backend: `npm run dev`

### 4. Konfigurasi Frontend
1. Buka terminal baru, masuk ke folder frontend: `cd frontend`
2. Instal dependensi: `npm install`
3. Buat file `.env` di dalam folder frontend:
```env
VITE_API_URL=http://localhost:5000/api
```
4. Jalankan server frontend: `npm run dev`
5. Buka `http://localhost:5173` di browser Anda.

---

## 🎓 Hak Cipta & Lisensi
Proyek ini dibuat oleh **Muhammad Gani Ramadhani** sebagai bagian dari Tugas Akhir Skripsi di Fakultas Ilmu Komputer, Universitas Dian Nuswantoro. Seluruh hak cipta desain dan kode dilindungi.
