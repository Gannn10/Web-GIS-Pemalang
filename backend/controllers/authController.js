const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIN ADMIN
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Cek apakah user ada di database
        const query = `SELECT * FROM users WHERE username = $1`;
        const result = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Username tidak ditemukan' });
        }

        const user = result.rows[0];

        // 2. Cek apakah password cocok (Decoding Hash)
        // Password default di database schema Anda: 'admin123'
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Password salah' });
        }

        // 3. Buat Token JWT (Tiket Masuk)
        const token = jwt.sign(
            { id: user.user_id, role: user.role },
            process.env.JWT_SECRET || 'rahasia_skripsi_super_aman', // Pastikan ini ada di .env
            { expiresIn: '1d' } // Token berlaku 1 hari
        );

        res.json({
            success: true,
            message: 'Login berhasil',
            token: token,
            user: {
                id: user.user_id,
                username: user.username,
                fullname: user.full_name
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// CEK STATUS LOGIN (Untuk Auto-login di Frontend nanti)
exports.getMe = async (req, res) => {
    try {
        // req.user didapat dari middleware (nanti kita buat)
        const query = `SELECT user_id, username, full_name, role FROM users WHERE user_id = $1`;
        const result = await pool.query(query, [req.user.id]);
        
        res.json({
            success: true,
            user: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};