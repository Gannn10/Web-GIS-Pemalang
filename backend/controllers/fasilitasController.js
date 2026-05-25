const pool = require('../config/database');
const { formatImageUrl } = require('../utils/imageUrlFormatter');

/**
 * ========================================
 * GET ALL FASILITAS
 * ========================================
 */
exports.getAllFasilitas = async (req, res) => {
    try {
        const query = 'SELECT * FROM fasilitas ORDER BY nama_fasilitas ASC';
        const { rows } = await pool.query(query);
        
        const formattedRows = rows.map(row => {
            if (row.icon) {
                row.icon = formatImageUrl(row.icon, req);
            }
            return row;
        });
        
        res.json({
            success: true,
            count: formattedRows.length,
            data: formattedRows
        });
    } catch (error) {
        console.error('Error in getAllFasilitas:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data fasilitas'
        });
    }
};
