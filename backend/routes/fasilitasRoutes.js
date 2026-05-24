const express = require('express');
const router = express.Router();
const fasilitasController = require('../controllers/fasilitasController');

router.get('/', fasilitasController.getAllFasilitas);

module.exports = router;
