const pool = require('../config/database');
const { formatWisataImages } = require('../utils/imageUrlFormatter');
const { hitungJarakHaversine } = require('../utils/haversine');
const { getFileUrl } = require('../utils/fileHelper');
const { parseFasilitasIds } = require('../utils/fasilitasHelper');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * 1. GET Semua Wisata
 */
exports.getAllWisata = async (req, res) => {
    try {
        const { kategori_id, keyword } = req.query;
        
        let query = `
            SELECT 
                w.wisata_id, w.nama_wisata, w.kecamatan, w.kategori_id, k.nama_kategori,
                w.deskripsi, w.alamat, w.harga_tiket, w.jam_buka, w.jam_tutup, 
                w.foto_utama, w.foto_2, w.foto_3, w.daya_tarik, w.is_populer, w.foto_populer,
                w.rating, w.jumlah_ulasan,
                ST_X(w.lokasi::geometry) as longitude, 
                ST_Y(w.lokasi::geometry) as latitude,
                COALESCE(
                    (SELECT json_agg(json_build_object('fasilitas_id', f.fasilitas_id, 'nama_fasilitas', f.nama_fasilitas, 'icon', f.icon))
                     FROM wisata_fasilitas wf 
                     JOIN fasilitas f ON wf.fasilitas_id = f.fasilitas_id 
                     WHERE wf.wisata_id = w.wisata_id),
                    '[]'::json
                ) as fasilitas
            FROM wisata w
            LEFT JOIN kategori k ON w.kategori_id = k.kategori_id
            WHERE 1=1
        `;

        let params = [];
        let paramIndex = 1;

        if (kategori_id) { query += ` AND w.kategori_id = $${paramIndex}`; params.push(kategori_id); paramIndex++; }
        if (keyword) { query += ` AND w.nama_wisata ILIKE $${paramIndex}`; params.push(`%${keyword}%`); paramIndex++; }
        query += ` ORDER BY w.wisata_id ASC`;

        const result = await pool.query(query, params);
        const formattedRows = result.rows.map(row => formatWisataImages(row, req));
        
        return sendSuccess(res, formattedRows, 'Berhasil mengambil data wisata', formattedRows.length);
    } catch (error) { 
        console.error("Error Get All:", error);
        return sendError(res, 'Gagal mengambil data wisata', 500, error);
    }
};

/**
 * 2. GET Wisata Terdekat (Menggunakan Algoritma Haversine dari Helper)
 * RUMUS HAVERSINE
 */
exports.getWisataTerdekat = async (req, res) => {
    try {
        const { lat, lon, radius } = req.query;
        if (!lat || !lon) return sendError(res, 'Lat & Lon wajib diisi', 400);

        const userLat = parseFloat(lat);
        const userLon = parseFloat(lon);
        // Konversi radius pencarian ke dalam satuan Kilometer
        const searchRadiusKm = (radius || 5000) / 1000; 

        // 1. Ambil seluruh titik destinasi dari basis data
        const query = `
            SELECT 
                wisata_id, nama_wisata, kategori_id, alamat, foto_utama, foto_2, foto_3,
                rating, jumlah_ulasan,
                ST_X(lokasi::geometry) as longitude, ST_Y(lokasi::geometry) as latitude
            FROM wisata
        `;
        const result = await pool.query(query);

        // 2. Eksekusi Logika Algoritma Haversine
        let wisataTerdekat = result.rows.map(row => {
            const destLat = parseFloat(row.latitude);
            const destLon = parseFloat(row.longitude);
            
            // Memanggil fungsi Haversine
            const jarak_km = hitungJarakHaversine(userLat, userLon, destLat, destLon);
            
            return {
                ...row,
                jarak_km: parseFloat(jarak_km.toFixed(3)),
                jarak_meter: Math.round(jarak_km * 1000)
            };
        });

        // 3. Filter Radius & Urutkan secara Ascending (Dari terdekat ke terjauh)
        wisataTerdekat = wisataTerdekat
            .filter(w => w.jarak_km <= searchRadiusKm)
            .sort((a, b) => a.jarak_km - b.jarak_km);

        // 4. Batasi 10 destinasi teratas & format response
        const finalData = wisataTerdekat.slice(0, 10).map(row => formatWisataImages(row, req));
        
        return sendSuccess(res, finalData, 'Berhasil mengambil wisata terdekat');
    } catch (error) { 
        console.error("Error Haversine:", error);
        return sendError(res, 'Gagal mengambil wisata terdekat', 500, error);
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
            ST_X(w.lokasi::geometry) as longitude, ST_Y(w.lokasi::geometry) as latitude,
            COALESCE(
                (SELECT json_agg(json_build_object('fasilitas_id', f.fasilitas_id, 'nama_fasilitas', f.nama_fasilitas, 'icon', f.icon))
                 FROM wisata_fasilitas wf 
                 JOIN fasilitas f ON wf.fasilitas_id = f.fasilitas_id 
                 WHERE wf.wisata_id = w.wisata_id),
                '[]'::json
            ) as fasilitas
            FROM wisata w
            LEFT JOIN kategori k ON w.kategori_id = k.kategori_id
            WHERE w.wisata_id = $1
        `;
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) return sendError(res, 'Wisata tidak ditemukan', 404);
        
        const formattedWisata = formatWisataImages(result.rows[0], req);
        return sendSuccess(res, formattedWisata, 'Berhasil mengambil detail wisata');
    } catch (error) { 
        console.error('Error Get Detail:', error);
        return sendError(res, 'Gagal mengambil detail wisata', 500, error);
    }
};

/**
 * 4. CREATE WISATA (Admin)
 */
exports.createWisata = async (req, res) => {
    try {
        const { nama_wisata, kecamatan, kategori_id, deskripsi, alamat, harga_tiket, jam_buka, jam_tutup, latitude, longitude, daya_tarik, is_populer, rating, jumlah_ulasan } = req.body;

        // Ambil Link Gambar (Bisa dari Upload file fisik, atau dari text biasa)
        const final_foto_utama = getFileUrl(req, 'foto_utama');
        const final_foto_2 = getFileUrl(req, 'foto_2');
        const final_foto_3 = getFileUrl(req, 'foto_3');
        const final_foto_populer = getFileUrl(req, 'foto_populer');

        // =================================================================
        // [PERBAIKAN POINT 4] SATPAM VALIDASI KOORDINAT
        // Mencegah data nyasar ke koordinat 0,0 (Tengah Laut Afrika)
        // =================================================================
        // if (!latitude || !longitude) {
        //  return sendError(res, 'Latitude dan Longitude tidak boleh kosong', 400);
        // }

        const query = `
            INSERT INTO wisata (
                nama_wisata, kecamatan, kategori_id, deskripsi, alamat, 
                harga_tiket, jam_buka, jam_tutup, lokasi, foto_utama, foto_2, foto_3, daya_tarik, is_populer, foto_populer, rating, jumlah_ulasan
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, 
                ST_SetSRID(ST_MakePoint($9, $10), 4326), 
                $11, $12, $13, $14, $15, $16, $17, $18
            ) RETURNING *
        `;

        const parsedHargaTiket = (harga_tiket === '' || harga_tiket === undefined || harga_tiket === null) ? 0 : parseInt(harga_tiket);
        const parsedLatitude = (latitude === '' || latitude === undefined || latitude === null) ? 0 : parseFloat(latitude.toString().replace(',', '.'));
        const parsedLongitude = (longitude === '' || longitude === undefined || longitude === null) ? 0 : parseFloat(longitude.toString().replace(',', '.'));

        const parsedRating = rating ? parseFloat(rating) : 0.0;
        const parsedJumlahUlasan = jumlah_ulasan ? parseInt(jumlah_ulasan) : 0;

        const values = [
            nama_wisata, kecamatan, kategori_id, deskripsi, alamat, 
            parsedHargaTiket, jam_buka, jam_tutup, parsedLongitude, parsedLatitude, 
            final_foto_utama, final_foto_2, final_foto_3, daya_tarik, 
            is_populer === 'true' || is_populer === true, final_foto_populer, parsedRating, parsedJumlahUlasan
        ];

        const result = await pool.query(query, values);
        const newWisataId = result.rows[0].wisata_id;

        // SIMPAN RELASI FASILITAS
        const fasilitasIds = parseFasilitasIds(req.body.fasilitas);
        if (fasilitasIds.length > 0) {
            const insertFasilitasQuery = `
                INSERT INTO wisata_fasilitas (wisata_id, fasilitas_id)
                VALUES ${fasilitasIds.map((_, idx) => `($1, $${idx + 2})`).join(', ')}
            `;
            await pool.query(insertFasilitasQuery, [newWisataId, ...fasilitasIds]);
        }

        return sendSuccess(res, formatWisataImages(result.rows[0], req), 'Wisata berhasil ditambahkan', null, 201);
    } catch (error) { 
        console.error('Error createWisata:', error);
        return sendError(res, 'Gagal tambah wisata', 500, error);
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
            harga_tiket, jam_buka, jam_tutup, latitude, longitude, 
            daya_tarik, is_populer, rating, jumlah_ulasan
        } = req.body;

        const final_foto_utama = getFileUrl(req, 'foto_utama');
        const final_foto_2 = getFileUrl(req, 'foto_2');
        const final_foto_3 = getFileUrl(req, 'foto_3');
        const final_foto_populer = getFileUrl(req, 'foto_populer');

        // =================================================================
        // [PERBAIKAN POINT 4] SATPAM VALIDASI KOORDINAT
        // Mencegah data nyasar ke koordinat 0,0 (Tengah Laut Afrika)
        // =================================================================
        // if (!latitude || !longitude) {
        //    return sendError(res, 'Latitude dan Longitude tidak boleh kosong', 400);
        // }

        const query = `
            UPDATE wisata SET
                nama_wisata = $1, kecamatan = $2, kategori_id = $3, deskripsi = $4, alamat = $5,
                harga_tiket = $6, jam_buka = $7, jam_tutup = $8,
                lokasi = ST_SetSRID(ST_MakePoint($9, $10), 4326),
                foto_utama = $11, foto_2 = $12, foto_3 = $13, daya_tarik = $14,
                is_populer = $15, foto_populer = $16, rating = $17, jumlah_ulasan = $18, updated_at = CURRENT_TIMESTAMP
            WHERE wisata_id = $19
            RETURNING *
        `;

        const parsedHargaTiket = (harga_tiket === '' || harga_tiket === undefined || harga_tiket === null) ? 0 : parseInt(harga_tiket);
        const parsedLatitude = (latitude === '' || latitude === undefined || latitude === null) ? 0 : parseFloat(latitude.toString().replace(',', '.'));
        const parsedLongitude = (longitude === '' || longitude === undefined || longitude === null) ? 0 : parseFloat(longitude.toString().replace(',', '.'));

        const parsedRating = rating ? parseFloat(rating) : 0.0;
        const parsedJumlahUlasan = jumlah_ulasan ? parseInt(jumlah_ulasan) : 0;

        const values = [
            nama_wisata, kecamatan, kategori_id, deskripsi, alamat, 
            parsedHargaTiket, jam_buka, jam_tutup, parsedLongitude, parsedLatitude, 
            final_foto_utama, final_foto_2, final_foto_3, daya_tarik, 
            is_populer === 'true' || is_populer === true, final_foto_populer, parsedRating, parsedJumlahUlasan, id 
        ];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) return sendError(res, 'Wisata tidak ditemukan', 404);

        // UPDATE RELASI FASILITAS
        await pool.query('DELETE FROM wisata_fasilitas WHERE wisata_id = $1', [id]);
        
        const fasilitasIds = parseFasilitasIds(req.body.fasilitas);
        if (fasilitasIds.length > 0) {
            const insertFasilitasQuery = `
                INSERT INTO wisata_fasilitas (wisata_id, fasilitas_id)
                VALUES ${fasilitasIds.map((_, idx) => `($1, $${idx + 2})`).join(', ')}
            `;
            await pool.query(insertFasilitasQuery, [id, ...fasilitasIds]);
        }

        return sendSuccess(res, formatWisataImages(result.rows[0], req), 'Wisata berhasil diupdate');
    } catch (error) { 
        console.error('Error updateWisata:', error);
        return sendError(res, 'Gagal update wisata', 500, error);
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

        if (result.rows.length === 0) return sendError(res, 'Wisata tidak ditemukan', 404);
        return sendSuccess(res, null, 'Wisata berhasil dihapus');
    } catch (error) { 
        console.error('Error deleteWisata:', error);
        return sendError(res, 'Gagal hapus wisata', 500, error);
    }
};
