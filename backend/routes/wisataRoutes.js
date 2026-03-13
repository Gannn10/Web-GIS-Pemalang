const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const wisataController = require('../controllers/wisataController');
const authMiddleware = require('../middleware/auth');

// ==============================
// SETUP MULTER (MESIN PENANGKAP FOTO)
// ==============================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Arahkan ke folder uploads yang udah kamu bikin
    },
    filename: function (req, file, cb) {
        // Bikin nama file unik pakai kombinasi tanggal dan angka acak
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter khusus biar cuma nerima gambar
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar (JPG, PNG, dll) yang diperbolehkan!'), false);
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Batas maksimal ukuran foto = 5MB
});

// Kita set multer untuk menangkap 3 field foto sekaligus
const uploadFotos = upload.fields([
    { name: 'foto_utama', maxCount: 1 },
    { name: 'foto_2', maxCount: 1 },
    { name: 'foto_3', maxCount: 1 }
]);

// ==============================
// 1. PUBLIC ROUTES (Bisa diakses siapa saja)
// ==============================
router.get('/', wisataController.getAllWisata);
router.get('/terdekat', wisataController.getWisataTerdekat);
router.get('/:id', wisataController.getWisataById);

// ==============================
// 2. PROTECTED ROUTES (Hanya Admin yang login)
// ==============================

// Tambah Wisata Baru (Pasang uploadFotos di tengah-tengah)
router.post('/', authMiddleware, uploadFotos, wisataController.createWisata); 

// Update Data Wisata (Pasang uploadFotos di tengah-tengah)
router.put('/:id', authMiddleware, uploadFotos, wisataController.updateWisata);

// Hapus Wisata
router.delete('/:id', authMiddleware, wisataController.deleteWisata);

module.exports = router;