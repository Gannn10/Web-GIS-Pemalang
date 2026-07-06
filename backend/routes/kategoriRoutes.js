const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');
const auth = require('../middleware/auth'); // Tambahkan auth middleware

/**
 * =========================================
 * KATEGORI ROUTES
 * =========================================
 * Routes untuk mendapatkan data kategori wisata
 * (Wisata Bahari, Wisata Alam, Wisata Buatan, Wisata Religi)
 */

/**
 * @route   GET /api/kategori
 * @desc    Mendapatkan semua kategori wisata beserta jumlah destinasi per kategori
 * @access  Public
 */
router.get('/', kategoriController.getAllKategori);

/**
 * @route   GET /api/kategori/:id
 * @desc    Mendapatkan detail satu kategori berdasarkan ID
 * @access  Public
 */
router.get('/:id', kategoriController.getKategoriById);

/**
 * @route   POST /api/kategori
 * @desc    Menambahkan kategori baru
 * @access  Private (Admin Only)
 */
router.post('/', auth, kategoriController.createKategori);

/**
 * @route   PUT /api/kategori/:id
 * @desc    Memperbarui kategori yang ada
 * @access  Private (Admin Only)
 */
router.put('/:id', auth, kategoriController.updateKategori);

/**
 * @route   DELETE /api/kategori/:id
 * @desc    Menghapus kategori
 * @access  Private (Admin Only)
 */
router.delete('/:id', auth, kategoriController.deleteKategori);

module.exports = router;