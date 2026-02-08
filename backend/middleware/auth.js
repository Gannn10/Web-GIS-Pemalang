const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Ambil token dari header
    const token = req.header('Authorization');

    // 2. Kalau tidak ada token, tolak
    if (!token) {
        return res.status(401).json({ success: false, message: 'Akses ditolak. Silakan login.' });
    }

    try {
        // 3. Verifikasi token (Bearer TOKEN_STRING)
        // Kita split karena formatnya biasanya "Bearer <token>"
        const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        
        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET || 'rahasia_skripsi_super_aman');
        
        // Simpan data user di request agar bisa dipakai di controller
        req.user = decoded;
        next(); // Lanjut ke controller
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token tidak valid' });
    }
};