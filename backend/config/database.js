const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Event listener (opsional, untuk debug saat ada klien baru terkoneksi)
pool.on('connect', () => {
    // console.log('Sebuah client baru terhubung ke pool');
});

// Event listener error (penting agar server tidak crash jika database putus)
pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
});

// 🔥 TEST KONEKSI LANGSUNG SAAT SERVER NYALA 🔥
// Ini penting supaya Anda langsung tahu kalau settingan .env sudah benar
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Gagal terhubung ke Database:', err.message);
    } else {
        console.log('✅ Berhasil terhubung ke PostgreSQL!');
        console.log(`🕒 Waktu Server Database: ${res.rows[0].now}`);
    }
});

module.exports = pool;