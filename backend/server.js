const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Inisialisasi Koneksi Database
require('./config/database');

// Inisialisasi Aplikasi Express
const app = express();
const PORT = process.env.PORT || 5000;

/**
 * =========================================
 * 1. MIDDLEWARE GLOBAL
 * =========================================
 */
// Mengizinkan akses dari Frontend (CORS) agar tidak diblokir browser
app.use(cors());

// Memungkinkan Express membaca data JSON dari request body (misal saat POST data)
app.use(express.json());
// Memungkinkan Express membaca data form-urlencoded
app.use(express.urlencoded({ extended: true }));

/**
 * =========================================
 * 2. ROUTING UTAMA (API ENDPOINTS)
 * =========================================
 */
// Route dasar untuk mengecek status server aktif
app.get('/', (req, res) => {
    res.json({
        message: '🏝️ API Sistem Informasi Geografis Pariwisata Pemalang',
        version: '1.0.0',
        status: 'Server Berjalan Normal'
    });
});

// Import file-file router untuk masing-masing modul
const wisataRoutes = require('./routes/wisataRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const fasilitasRoutes = require('./routes/fasilitasRoutes');
const authRoutes = require('./routes/authRoutes');

// Daftarkan router ke endpoint awalan (prefix) tertentu
app.use('/api/wisata', wisataRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/fasilitas', fasilitasRoutes);
app.use('/api/auth', authRoutes);

/**
 * =========================================
 * 3. PENANGANAN ERROR (ERROR HANDLING)
 * =========================================
 */
// Middleware jika terjadi error pada kode di atas (Internal Server Error)
app.use((err, req, res, next) => {
    console.error('Terjadi Kesalahan (Log Error):', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Terjadi masalah pada server internal.'
    });
});

// Middleware jika rute/URL API yang diakses tidak ditemukan (Error 404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint API tidak ditemukan.'
    });
});

/**
 * =========================================
 * 4. MENJALANKAN SERVER (START LISTENING)
 * =========================================
 */
app.listen(PORT, () => {
    console.log(`\n🚀 Server berhasil berjalan di http://localhost:${PORT}`);
    console.log(`📊 Mode Lingkungan: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database terhubung ke: ${process.env.DB_NAME}\n`);
});