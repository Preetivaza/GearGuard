const express = require('express');
const router = express.Router();
const {
    getTestActivities,
    getTestActivity,
    createTestActivity,
    updateTestActivity,
    deleteTestActivity,
    getEquipmentTestHistory,
    getTestActivityStats
} = require('../controllers/testActivityController');
const { protect, authorize } = require('../middleware/auth');

// Stats route (must be before /:id)
router.get('/stats', protect, getTestActivityStats);

// Equipment test history
router.get('/equipment/:equipmentId', protect, getEquipmentTestHistory);

// Main CRUD routes
router.route('/')
    .get(protect, getTestActivities)
    .post(protect, createTestActivity);

router.route('/:id')
    .get(protect, getTestActivity)
    .put(protect, updateTestActivity)
    .delete(protect, authorize('Manager'), deleteTestActivity);

module.exports = router;
