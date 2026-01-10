const express = require('express');
const router = express.Router();
const { getDashboardStats, getRecentActivities } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

// Dashboard statistics route
router.get('/dashboard', protect, getDashboardStats);

// Recent activities route
router.get('/recent-activities', protect, getRecentActivities);

module.exports = router;
