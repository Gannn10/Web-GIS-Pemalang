const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const wisataController = require('../controllers/wisataController');
const authMiddleware = require('../middleware/auth');

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// ==============================
// SETUP CLOUDINARY
// ==============================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pemalang_tourism', // Nama folder di dalam Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 25 * 1024 * 1024 } // Batas 25MB
});

// Kita set multer untuk menangkap 3 field foto sekaligus
const uploadFotos = upload.fields([
    { name: 'foto_utama', maxCount: 1 },
    { name: 'foto_2', maxCount: 1 },
    { name: 'foto_3', maxCount: 1 },
    { name: 'foto_populer', maxCount: 1 }
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