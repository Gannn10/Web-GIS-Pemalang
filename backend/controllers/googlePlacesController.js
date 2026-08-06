const axios = require('axios');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * Sync rating from Google Places API
 * Endpoint: POST /api/wisata/sync-rating
 */
exports.syncRating = async (req, res) => {
    try {
        const { nama_wisata } = req.body;
        
        if (!nama_wisata) {
            return sendError(res, 'Nama wisata diperlukan untuk mencari di Google', 400);
        }

        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!apiKey) {
            return sendError(res, 'Google Places API Key belum dikonfigurasi di server', 500);
        }

        // Tambahkan "Pemalang" agar pencarian lebih akurat
        const query = `${nama_wisata} Pemalang`;
        
        const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=rating,user_ratings_total,place_id,name&key=${apiKey}`;

        const response = await axios.get(url);
        
        if (response.data.status === 'OK' && response.data.candidates.length > 0) {
            const place = response.data.candidates[0];
            
            return sendSuccess(res, {
                rating: place.rating || 0,
                jumlah_ulasan: place.user_ratings_total || 0,
                place_id: place.place_id,
                google_name: place.name
            }, 'Berhasil mendapatkan data rating dari Google');
        } else {
            return sendError(res, 'Tempat tidak ditemukan di Google Maps', 404);
        }
    } catch (error) {
        console.error('Error Sync Google Rating:', error.message);
        return sendError(res, 'Gagal mengambil data dari Google', 500, error);
    }
};
