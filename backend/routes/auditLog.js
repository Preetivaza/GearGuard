const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAuditLogs,
    getEntityAuditLogs,
    getUserActivitySummary,
} = require('../controllers/auditLogController');

router.route('/').get(protect, authorize('Manager'), getAuditLogs);

router.route('/summary/user-activity').get(protect, authorize('Manager'), getUserActivitySummary);

router.route('/:entityType/:entityId').get(protect, authorize('Manager'), getEntityAuditLogs);

module.exports = router;
