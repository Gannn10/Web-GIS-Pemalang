const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * ============================================================================
 * FUNGSI: login
 * ============================================================================
 * Menangani proses otentikasi admin. Mengecek kecocokan username dan password, 
 * lalu memberikan token JWT jika valid.
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Validasi: Cari data admin berdasarkan username di database
        const query = `SELECT * FROM users WHERE username = $1`;
        const result = await pool.query(query, [username]);

        // Jika username tidak ada di tabel users
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Username tidak ditemukan.' });
        }

        const user = result.rows[0];

        // 2. Keamanan: Bandingkan password input dengan password hash di database
        const isMatch = await bcrypt.compare(password, user.password_hash);

        // Jika password salah
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Password salah.' });
        }

        // 3. Otorisasi: Buat Token JWT sebagai 'Kunci Akses' untuk frontend
        const token = jwt.sign(
            { id: user.user_id, role: user.role },
            process.env.JWT_SECRET || 'rahasia_skripsi_super_aman', 
            { expiresIn: '1d' } // Masa berlaku token: 1 hari
        );

        res.json({
            success: true,
            message: 'Login berhasil.',
            token: token,
            user: {
                id: user.user_id,
                username: user.username,
                fullname: user.full_name
            }
        });

    } catch (error) {
        console.error('Terjadi kesalahan saat Login:', error);
        res.status(500).json({ success: false, message: 'Terjadi masalah pada server.' });
    }
};

/**
 * ============================================================================
 * FUNGSI: getMe
 * ============================================================================
 * Mengecek status sesi login. Biasanya dipanggil otomatis oleh Frontend saat 
 * halaman dimuat ulang (refresh) untuk memastikan admin masih login.
 */
exports.getMe = async (req, res) => {
    try {
        // req.user didapat dari middleware otentikasi (auth.js)
        const query = `SELECT user_id, username, full_name, role FROM users WHERE user_id = $1`;
        const result = await pool.query(query, [req.user.id]);
        
        res.json({
            success: true,
            user: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Terjadi masalah pada server saat memuat data user.' });
    }
};