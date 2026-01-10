const express = require('express');
const router = express.Router();
const { seedDummyData } = require('../controllers/seedController');
const { protect, authorize } = require('../middleware/auth');

// Seed dummy data route (Manager only)
router.post('/dummy-data', protect, authorize('Manager'), seedDummyData);

module.exports = router;
