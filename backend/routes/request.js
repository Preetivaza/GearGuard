const express = require('express');
const router = express.Router();
const {
    getRequests,
    getRequestById,
    createRequest,
    updateRequest,
    deleteRequest,
    getKanbanData,
    getCalendarData,
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

router.get('/kanban', protect, getKanbanData);
router.get('/calendar', protect, getCalendarData);

router.route('/')
    .get(protect, getRequests)
    .post(protect, createRequest);

router.route('/:id')
    .get(protect, getRequestById)
    .put(protect, updateRequest)
    .delete(protect, authorize('Manager'), deleteRequest);

module.exports = router;
