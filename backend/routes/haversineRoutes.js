const express = require('express');
const router = express.Router();
const haversineController = require('../controllers/haversineController');

// URL: http://localhost:5000/api/haversine?lat=...&lon=...
router.get('/', haversineController.getWisataByHaversine);

module.exports = router;