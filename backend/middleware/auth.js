const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

module.exports = (req, res, next) => {
    // 1. Ambil token dari header
    const token = req.header('Authorization');

    // 2. Kalau tidak ada token, tolak
    if (!token) {
        return res.status(401).json({ success: false, message: 'Akses ditolak. Silakan login.' });
    }

    try {
        // 3. Verifikasi token (Bearer TOKEN_STRING)
        const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        
        const decoded = jwt.verify(tokenString, JWT_SECRET);
        
        // Simpan data user di request agar bisa dipakai di controller
        req.user = decoded;

        // 4. Validasi role (hanya admin yang diizinkan untuk route yang memakai middleware ini)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Akses ditolak. Anda bukan admin.' });
        }

        next(); // Lanjut ke controller
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token tidak valid' });
    }
};