const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getDashboardStats,
    getRecentActivities,
    getEquipmentAnalytics,
    getRequestTrends,
    getCostAnalytics,
    getSLACompliance,
    getTeamPerformance,
} = require('../controllers/statsController');

// Dashboard statistics route
router.route('/dashboard').get(protect, getDashboardStats);
router.route('/recent-activities').get(protect, getRecentActivities);
router.route('/equipment-analytics').get(protect, getEquipmentAnalytics);
router.route('/request-trends').get(protect, getRequestTrends);
router.route('/cost-analytics').get(protect, authorize('Manager'), getCostAnalytics);
router.route('/sla-compliance').get(protect, getSLACompliance);
router.route('/team-performance').get(protect, authorize('Manager'), getTeamPerformance);

module.exports = router;
