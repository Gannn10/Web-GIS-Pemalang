const express = require('express');
const router = express.Router();
const wisataController = require('../controllers/wisataController');
const authMiddleware = require('../middleware/auth');

// ==============================
// 1. PUBLIC ROUTES (Bisa diakses siapa saja)
// ==============================

// Ambil semua data wisata (bisa filter & search)
// URL: GET /api/wisata
router.get('/', wisataController.getAllWisata);

// Ambil wisata terdekat (Fitur Utama PostGIS)
// URL: GET /api/wisata/terdekat
router.get('/terdekat', wisataController.getWisataTerdekat);

// Ambil detail satu wisata
// URL: GET /api/wisata/:id
router.get('/:id', wisataController.getWisataById);


// ==============================
// 2. PROTECTED ROUTES (Hanya Admin yang login)
// ==============================

// Tambah Wisata Baru
// URL: POST /api/wisata
router.post('/', authMiddleware, wisataController.createWisata); 

// Update Data Wisata
// URL: PUT /api/wisata/:id
router.put('/:id', authMiddleware, wisataController.updateWisata);

// Hapus Wisata
// URL: DELETE /api/wisata/:id
router.delete('/:id', authMiddleware, wisataController.deleteWisata);

module.exports = router;