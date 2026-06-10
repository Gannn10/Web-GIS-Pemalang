const { Pool } = require('pg');
require('dotenv').config();

// Cek apakah aplikasi sedang berjalan di server publik (Production) atau di laptop lokal (Development)
const isProduction = process.env.NODE_ENV === 'production' || (process.env.DB_HOST && process.env.DB_HOST !== 'localhost');

// Konfigurasi dasar untuk koneksi ke database PostgreSQL
const poolConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pemalang_gis', 
    password: process.env.DB_PASSWORD || 'pemalang', 
    port: process.env.DB_PORT || 5432,
};

// Jika berada di server publik (misal: Supabase/Render), aktifkan SSL agar koneksi aman
if (isProduction) {
    poolConfig.ssl = {
        require: true,
        rejectUnauthorized: false
    };
}

// Inisialisasi Kolam Koneksi (Pool). 
// Jika ada DATABASE_URL dari .env (biasanya saat hosting), gunakan itu. Jika tidak, pakai konfigurasi lokal.
const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
      })
    : new Pool(poolConfig);

// Event Listener: Dipicu ketika ada masalah dengan koneksi database secara tiba-tiba
pool.on('error', (err) => {
    console.error('❌ Terjadi kesalahan tak terduga pada koneksi database:', err);
    process.exit(-1); // Matikan proses agar PM2/Server me-restart aplikasi secara otomatis
});

// 🔥 TEST KONEKSI AWAL 🔥
// Saat server pertama kali dinyalakan, coba kirim perintah sederhana (SELECT NOW())
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Gagal terhubung ke Database PostgreSQL:', err.message);
    } else {
        console.log('✅ Berhasil terhubung ke PostgreSQL!');
    }
});

module.exports = pool;