const pool = require('../config/database');

/**
 * ========================================
 * GET ALL FASILITAS
 * ========================================
 */
exports.getAllFasilitas = async (req, res) => {
    try {
        const query = 'SELECT * FROM fasilitas ORDER BY nama_fasilitas ASC';
        const { rows } = await pool.query(query);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error in getAllFasilitas:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data fasilitas'
        });
    }
};
