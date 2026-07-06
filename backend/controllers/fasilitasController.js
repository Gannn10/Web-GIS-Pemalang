const pool = require('../config/database');
const { formatImageUrl } = require('../utils/imageUrlFormatter');
const { sendSuccess, sendError } = require('../utils/responseHelper');

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
        
        return sendSuccess(res, formattedRows, 'Berhasil mengambil data fasilitas', formattedRows.length);
    } catch (error) {
        console.error('Error in getAllFasilitas:', error);
        return sendError(res, 'Gagal mengambil data fasilitas', 500, error);
    }
};
