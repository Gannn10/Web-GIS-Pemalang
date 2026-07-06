/**
 * Fungsi Pintar: Mengambil URL langsung dari Cloudinary atau req.body
 */
const getFileUrl = (req, fieldName) => {
    // Kalau ada file yang di-upload via Cloudinary
    if (req.files && req.files[fieldName]) {
        return req.files[fieldName][0].path;
    }
    // Kalau nggak ada file yang di-upload, ambil dari request body biasa
    return req.body[fieldName] || null;
};

module.exports = { getFileUrl };
