const pool = require('../config/database');

/**
 * ========================================
 * GET ALL KATEGORI
 * ========================================
 */
exports.getAllKategori = async (req, res) => {
    try {
        const query = `
            SELECT 
                k.*,
                COUNT(w.wisata_id) as jumlah_wisata
            FROM kategori k
            LEFT JOIN wisata w ON k.kategori_id = w.kategori_id AND w.status = 'active'
            GROUP BY k.kategori_id
            ORDER BY k.nama_kategori ASC
        `;
        
        const { rows } = await pool.query(query);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
        
    } catch (error) {
        console.error('Error in getAllKategori:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data kategori'
        });
    }
};

/**
 * ========================================
 * GET KATEGORI BY ID
 * ========================================
 */
exports.getKategoriById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT 
                k.*,
                COUNT(w.wisata_id) as jumlah_wisata
            FROM kategori k
            LEFT JOIN wisata w ON k.kategori_id = w.kategori_id AND w.status = 'active'
            WHERE k.kategori_id = $1
            GROUP BY k.kategori_id
        `;
        
        const { rows } = await pool.query(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
        
    } catch (error) {
        console.error('Error in getKategoriById:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil detail kategori'
        });
    }
};