const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');

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
 * @return  Array kategori dengan field: kategori_id, nama_kategori, deskripsi, icon_url, jumlah_wisata
 * @example GET /api/kategori
 */
router.get('/', kategoriController.getAllKategori);

/**
 * @route   GET /api/kategori/:id
 * @desc    Mendapatkan detail satu kategori berdasarkan ID
 * @access  Public
 * @params  URL Param: id (kategori_id)
 * @return  Object kategori dengan jumlah wisata dalam kategori tersebut
 * @example GET /api/kategori/1
 */
router.get('/:id', kategoriController.getKategoriById);

module.exports = router;