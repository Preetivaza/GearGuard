const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} = require('../controllers/notificationController');

router.route('/').get(protect, getNotifications);

router.route('/read-all').patch(protect, markAllAsRead);

router.route('/:id/read').patch(protect, markAsRead);

router.route('/:id').delete(protect, deleteNotification);

module.exports = router;
