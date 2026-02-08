// Kita pakai 'pool' biar konsisten sama file kategoriController.js
const pool = require('../config/database');

/**
 * 1. GET Semua Wisata (Bisa Filter & Search)
 */
exports.getAllWisata = async (req, res) => {
    try {
        const { kategori_id, keyword } = req.query;
        
        let query = `
            SELECT 
                w.wisata_id, w.nama_wisata, w.kategori_id, k.nama_kategori,
                w.alamat, w.harga_tiket, w.foto_utama,
                ST_X(w.lokasi::geometry) as longitude, 
                ST_Y(w.lokasi::geometry) as latitude 
            FROM wisata w
            LEFT JOIN kategori k ON w.kategori_id = k.kategori_id
            WHERE 1=1
        `;

        const params = [];
        let paramIndex = 1;

        if (kategori_id) {
            query += ` AND w.kategori_id = $${paramIndex}`;
            params.push(kategori_id);
            paramIndex++;
        }

        if (keyword) {
            query += ` AND w.nama_wisata ILIKE $${paramIndex}`;
            params.push(`%${keyword}%`);
            paramIndex++;
        }

        query += ` ORDER BY w.wisata_id ASC`;

        const result = await pool.query(query, params);
        
        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Error getAllWisata:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * 2. GET Wisata Terdekat (PostGIS)
 */
exports.getWisataTerdekat = async (req, res) => {
    try {
        const { lat, lon, radius } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ success: false, message: 'Lat & Lon wajib diisi' });
        }

        const searchRadius = radius || 5000; 

        const query = `
            SELECT 
                wisata_id, nama_wisata, kategori_id, alamat, foto_utama,
                ST_X(lokasi::geometry) as longitude, 
                ST_Y(lokasi::geometry) as latitude,
                ST_DistanceSphere(lokasi, ST_SetSRID(ST_MakePoint($1, $2), 4326)) as jarak_meter
            FROM wisata
            WHERE ST_DWithin(lokasi, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3 / 111319.9)
            ORDER BY jarak_meter ASC
            LIMIT 10;
        `;

        const result = await pool.query(query, [parseFloat(lon), parseFloat(lat), parseFloat(searchRadius)]);

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Error getWisataTerdekat:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * 3. GET Detail Wisata
 */
exports.getWisataById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT w.*, k.nama_kategori,
            ST_X(w.lokasi::geometry) as longitude, ST_Y(w.lokasi::geometry) as latitude
            FROM wisata w
            LEFT JOIN kategori k ON w.kategori_id = k.kategori_id
            WHERE w.wisata_id = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Wisata tidak ditemukan' });
        }

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error getWisataById:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * 4. CREATE WISATA (Admin)
 */
exports.createWisata = async (req, res) => {
    try {
        const { 
            nama_wisata, kecamatan, kategori_id, deskripsi, alamat, 
            harga_tiket, jam_buka, jam_tutup, latitude, longitude, foto_utama 
        } = req.body;

        const query = `
            INSERT INTO wisata (
                nama_wisata, kecamatan, kategori_id, deskripsi, alamat, 
                harga_tiket, jam_buka, jam_tutup, lokasi, foto_utama
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, 
                ST_SetSRID(ST_MakePoint($9, $10), 4326), 
                $11
            ) RETURNING *
        `;

        const values = [
            nama_wisata, kecamatan, kategori_id, deskripsi, alamat, 
            harga_tiket, jam_buka, jam_tutup, parseFloat(longitude), parseFloat(latitude), foto_utama
        ];

        const result = await pool.query(query, values);

        res.status(201).json({
            success: true,
            message: 'Wisata berhasil ditambahkan',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error createWisata:', error);
        res.status(500).json({ success: false, message: 'Gagal tambah wisata', error: error.message });
    }
};

/**
 * 5. UPDATE WISATA (Admin)
 */
exports.updateWisata = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nama_wisata, kecamatan, kategori_id, deskripsi, alamat, 
            harga_tiket, jam_buka, jam_tutup, latitude, longitude, foto_utama 
        } = req.body;

        const query = `
            UPDATE wisata SET
                nama_wisata = $1, kecamatan = $2, kategori_id = $3, deskripsi = $4, alamat = $5,
                harga_tiket = $6, jam_buka = $7, jam_tutup = $8,
                lokasi = ST_SetSRID(ST_MakePoint($9, $10), 4326),
                foto_utama = $11, updated_at = CURRENT_TIMESTAMP
            WHERE wisata_id = $12
            RETURNING *
        `;

        const values = [
            nama_wisata, kecamatan, kategori_id, deskripsi, alamat, 
            harga_tiket, jam_buka, jam_tutup, parseFloat(longitude), parseFloat(latitude), foto_utama, id
        ];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Wisata tidak ditemukan' });
        }

        res.status(200).json({
            success: true,
            message: 'Wisata berhasil diupdate',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error updateWisata:', error);
        res.status(500).json({ success: false, message: 'Gagal update wisata', error: error.message });
    }
};

/**
 * 6. DELETE WISATA (Admin)
 */
exports.deleteWisata = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM wisata WHERE wisata_id = $1 RETURNING *`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Wisata tidak ditemukan' });
        }

        res.status(200).json({
            success: true,
            message: 'Wisata berhasil dihapus'
        });

    } catch (error) {
        console.error('Error deleteWisata:', error);
        res.status(500).json({ success: false, message: 'Gagal hapus wisata', error: error.message });
    }
};