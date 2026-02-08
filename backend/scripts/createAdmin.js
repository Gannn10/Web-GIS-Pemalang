require('dotenv').config(); // Pastikan env terbaca
const bcrypt = require('bcryptjs');
const db = require('../config/database'); // Import koneksi database

const createAdminAccount = async () => {
    try {
        const username = 'admin';
        const password = 'pemalang'; // Password mentah yang akan kita pakai login
        const email = 'admin@gmail.com';
        const fullName = 'Administrator WebGIS';

        console.log(`⏳ Sedang membuat akun admin: ${username}...`);

        // 1. Enkripsi Password (Hashing)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 2. Masukkan ke Database
        // Kita pakai "ON CONFLICT DO NOTHING" agar kalau sudah ada, tidak error
        const query = `
            INSERT INTO users (username, password_hash, email, full_name, role)
            VALUES ($1, $2, $3, $4, 'admin')
            ON CONFLICT (username) DO UPDATE 
            SET password_hash = $2 -- Kalau user admin sudah ada, kita reset passwordnya
            RETURNING *;
        `;

        const values = [username, passwordHash, email, fullName];
        
        const result = await db.query(query, values);

        console.log('✅ SUKSES! Akun Admin berhasil dibuat/diupdate.');
        console.log(`👤 Username: ${username}`);
        console.log(`🔑 Password: ${password}`);
        
        process.exit(0); // Matikan script setelah selesai

    } catch (error) {
        console.error('❌ Gagal membuat admin:', error);
        process.exit(1);
    }
};

createAdminAccount();
