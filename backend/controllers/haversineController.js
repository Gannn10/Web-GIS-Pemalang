const pool = require('../config/database');
const { hitungJarak } = require('../utils/haversine'); // Import rumus tadi

exports.getWisataByHaversine = async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ 
                success: false, 
                message: 'Latitude dan Longitude User wajib diisi!' 
            });
        }

        // 1. Ambil SEMUA data wisata dari database (Tanpa filter jarak dulu)
        // Kita ambil koordinatnya juga
        const query = `
            SELECT 
                wisata_id, nama_wisata, kategori_id, alamat, foto_utama,
                ST_X(lokasi::geometry) as longitude, 
                ST_Y(lokasi::geometry) as latitude
            FROM wisata
        `;
        
        const result = await pool.query(query);
        const allWisata = result.rows;

        // 2. Looping (Perulangan) JavaScript untuk hitung jarak satu per satu
        // Ini adalah implementasi Manual Haversine di sisi Aplikasi
        const wisataDenganJarak = allWisata.map((item) => {
            const jarakMeter = hitungJarak(
                parseFloat(lat), parseFloat(lon), // Posisi User
                item.latitude, item.longitude     // Posisi Wisata
            );
            
            return {
                ...item,
                jarak_meter: jarakMeter // Tambahkan field baru ke objek
            };
        });

        // 3. Sorting (Urutkan dari yang terdekat)
        wisataDenganJarak.sort((a, b) => a.jarak_meter - b.jarak_meter);

        // 4. Ambil 10 teratas saja (Limit)
        const top10Wisata = wisataDenganJarak.slice(0, 10);

        res.status(200).json({
            success: true,
            metode: 'Manual Haversine (JavaScript)',
            user_location: { lat, lon },
            count: top10Wisata.length,
            data: top10Wisata
        });

    } catch (error) {
        console.error('Error Haversine:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};