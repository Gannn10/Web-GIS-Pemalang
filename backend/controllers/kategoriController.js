const pool = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseHelper');

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
        return sendSuccess(res, rows, 'Berhasil mengambil data kategori', rows.length);
        
    } catch (error) {
        console.error('Error in getAllKategori:', error);
        return sendError(res, 'Gagal mengambil data kategori', 500, error);
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
            return sendError(res, 'Kategori tidak ditemukan', 404);
        }
        
        return sendSuccess(res, rows[0], 'Berhasil mengambil detail kategori');
        
    } catch (error) {
        console.error('Error in getKategoriById:', error);
        return sendError(res, 'Gagal mengambil detail kategori', 500, error);
    }
};

/**
 * ========================================
 * CREATE KATEGORI
 * ========================================
 */
exports.createKategori = async (req, res) => {
    try {
        const { nama_kategori, deskripsi, icon_url } = req.body;

        if (!nama_kategori) {
            return sendError(res, 'Nama kategori wajib diisi', 400);
        }

        const query = `
            INSERT INTO kategori (nama_kategori, deskripsi, icon_url)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        
        const { rows } = await pool.query(query, [nama_kategori, deskripsi, icon_url]);
        
        return sendSuccess(res, rows[0], 'Kategori berhasil ditambahkan', null, 201);
        
    } catch (error) {
        console.error('Error in createKategori:', error);
        if (error.code === '23505') { // Unique violation
            return sendError(res, 'Nama kategori sudah ada', 400);
        }
        return sendError(res, 'Gagal menambah kategori', 500, error);
    }
};

/**
 * ========================================
 * UPDATE KATEGORI
 * ========================================
 */
exports.updateKategori = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_kategori, deskripsi, icon_url } = req.body;

        if (!nama_kategori) {
            return sendError(res, 'Nama kategori wajib diisi', 400);
        }

        const query = `
            UPDATE kategori 
            SET nama_kategori = $1, deskripsi = $2, icon_url = $3 
            WHERE kategori_id = $4
            RETURNING *
        `;
        
        const { rows } = await pool.query(query, [nama_kategori, deskripsi, icon_url, id]);
        
        if (rows.length === 0) {
            return sendError(res, 'Kategori tidak ditemukan', 404);
        }
        
        return sendSuccess(res, rows[0], 'Kategori berhasil diupdate');
        
    } catch (error) {
        console.error('Error in updateKategori:', error);
        if (error.code === '23505') { // Unique violation
            return sendError(res, 'Nama kategori sudah ada', 400);
        }
        return sendError(res, 'Gagal update kategori', 500, error);
    }
};

/**
 * ========================================
 * DELETE KATEGORI
 * ========================================
 */
exports.deleteKategori = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Cek dulu apakah kategori masih dipakai di wisata
        const checkQuery = `SELECT COUNT(*) FROM wisata WHERE kategori_id = $1`;
        const checkResult = await pool.query(checkQuery, [id]);
        
        if (parseInt(checkResult.rows[0].count) > 0) {
            return sendError(res, 'Tidak dapat menghapus kategori yang masih memiliki destinasi wisata', 400);
        }

        const query = `DELETE FROM kategori WHERE kategori_id = $1 RETURNING *`;
        const { rows } = await pool.query(query, [id]);
        
        if (rows.length === 0) {
            return sendError(res, 'Kategori tidak ditemukan', 404);
        }
        
        return sendSuccess(res, null, 'Kategori berhasil dihapus');
        
    } catch (error) {
        console.error('Error in deleteKategori:', error);
        return sendError(res, 'Gagal menghapus kategori', 500, error);
    }
};