const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production' || (process.env.DB_HOST && process.env.DB_HOST !== 'localhost');

const poolConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pemalang_gis', // Sesuaikan dengan nama databasemu
    password: process.env.DB_PASSWORD || 'pemalang', // Sesuaikan dengan password databasemu
    port: process.env.DB_PORT || 5432,
};

if (isProduction) {
    poolConfig.ssl = {
        require: true,
        rejectUnauthorized: false
    };
}

const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
      })
    : new Pool(poolConfig);

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
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Gagal terhubung ke Database:', err.message);
    } else {
        console.log('✅ Berhasil terhubung ke PostgreSQL!');
    }
});

module.exports = pool;