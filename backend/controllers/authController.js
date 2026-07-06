const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * ============================================================================
 * FUNGSI: login
 * ============================================================================
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const query = `SELECT * FROM users WHERE username = $1`;
        const result = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            return sendError(res, 'Username tidak ditemukan.', 401);
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return sendError(res, 'Password salah.', 401);
        }

        const token = jwt.sign(
            { id: user.user_id, role: user.role },
            JWT_SECRET, 
            { expiresIn: '1d' } 
        );

        const responseData = {
            token: token,
            user: {
                id: user.user_id,
                username: user.username,
                fullname: user.full_name,
                role: user.role
            }
        };

        return sendSuccess(res, responseData, 'Login berhasil.');
    } catch (error) {
        console.error('Terjadi kesalahan saat Login:', error);
        return sendError(res, 'Terjadi masalah pada server.', 500, error);
    }
};

/**
 * ============================================================================
 * FUNGSI: getMe
 * ============================================================================
 */
exports.getMe = async (req, res) => {
    try {
        const query = `SELECT user_id, username, full_name, role FROM users WHERE user_id = $1`;
        const result = await pool.query(query, [req.user.id]);
        
        return sendSuccess(res, result.rows[0], 'Berhasil mengambil data user');
    } catch (error) {
        return sendError(res, 'Terjadi masalah pada server saat memuat data user.', 500, error);
    }
};