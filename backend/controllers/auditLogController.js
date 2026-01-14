const AuditLog = require('../models/AuditLog');

// Helper function to create audit log entry
exports.createAuditLog = async (data) => {
    try {
        await AuditLog.create(data);
    } catch (error) {
        console.error('Error creating audit log:', error);
    }
};

// @desc    Get audit logs
// @route   GET /api/audit-logs
// @access  Private (Manager only)
exports.getAuditLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const filter = {};

        // Filter by user
        if (req.query.user) {
            filter.user = req.query.user;
        }

        // Filter by action
        if (req.query.action) {
            filter.action = req.query.action;
        }

        // Filter by entity type
        if (req.query.entityType) {
            filter.entityType = req.query.entityType;
        }

        // Filter by date range
        if (req.query.startDate || req.query.endDate) {
            filter.createdAt = {};
            if (req.query.startDate) {
                filter.createdAt.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                filter.createdAt.$lte = new Date(req.query.endDate);
            }
        }

        const auditLogs = await AuditLog.find(filter)
            .populate('user', 'name email role department')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        const total = await AuditLog.countDocuments(filter);

        res.json({
            success: true,
            count: auditLogs.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: auditLogs,
        });
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching audit logs',
            error: error.message,
        });
    }
};

// @desc    Get audit logs for specific entity
// @route   GET /api/audit-logs/:entityType/:entityId
// @access  Private (Manager only)
exports.getEntityAuditLogs = async (req, res) => {
    try {
        const { entityType, entityId } = req.params;

        const auditLogs = await AuditLog.find({ entityType, entityId })
            .populate('user', 'name email role')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: auditLogs.length,
            data: auditLogs,
        });
    } catch (error) {
        console.error('Error fetching entity audit logs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching entity audit logs',
            error: error.message,
        });
    }
};

// @desc    Get user activity summary
// @route   GET /api/audit-logs/summary/user-activity
// @access  Private (Manager only)
exports.getUserActivitySummary = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const summary = await AuditLog.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        user: '$user',
                        action: '$action',
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: '$_id.user',
                    actions: {
                        $push: {
                            action: '$_id.action',
                            count: '$count',
                        },
                    },
                    totalActions: { $sum: '$count' },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo',
                },
            },
            {
                $unwind: '$userInfo',
            },
            {
                $project: {
                    user: {
                        _id: '$userInfo._id',
                        name: '$userInfo.name',
                        email: '$userInfo.email',
                        role: '$userInfo.role',
                    },
                    actions: 1,
                    totalActions: 1,
                },
            },
            {
                $sort: { totalActions: -1 },
            },
        ]);

        res.json({
            success: true,
            period: `Last ${days} days`,
            data: summary,
        });
    } catch (error) {
        console.error('Error fetching user activity summary:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user activity summary',
            error: error.message,
        });
    }
};
