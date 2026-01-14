const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const MaintenanceTeam = require('../models/MaintenanceTeam');

// @desc    Get dashboard statistics
// @route   GET /api/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        // Get total equipment count
        const totalEquipment = await Equipment.countDocuments();

        // Get active requests count (New or In Progress)
        const activeRequests = await MaintenanceRequest.countDocuments({
            status: { $in: ['New', 'In Progress'] }
        });

        // Get completed requests count (Repaired or Scrap status)
        const completedRequests = await MaintenanceRequest.countDocuments({
            status: { $in: ['Repaired', 'Scrap'] }
        });

        // Get total maintenance teams count
        const totalTeams = await MaintenanceTeam.countDocuments({
            isActive: true
        });

        // Return aggregated statistics
        res.json({
            success: true,
            data: {
                totalEquipment,
                activeRequests,
                completedRequests,
                totalTeams
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
};

// @desc    Get recent activities
// @route   GET /api/stats/recent-activities
// @access  Private
exports.getRecentActivities = async (req, res) => {
    try {
        const limit = 10;

        // Fetch recent equipment
        const recentEquipment = await Equipment.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('name createdAt')
            .lean();

        // Fetch recent maintenance requests
        const recentRequests = await MaintenanceRequest.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('title priority createdAt')
            .lean();

        // Fetch recent teams
        const recentTeams = await MaintenanceTeam.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('name createdAt')
            .lean();

        // Format activities
        const activities = [];

        // Add equipment activities
        recentEquipment.forEach(item => {
            activities.push({
                type: 'equipment',
                icon: '🔧',
                description: `New equipment added: ${item.name}`,
                timestamp: item.createdAt
            });
        });

        // Add request activities
        recentRequests.forEach(item => {
            activities.push({
                type: 'request',
                icon: '📝',
                description: `New request: ${item.title} (${item.priority})`,
                timestamp: item.createdAt
            });
        });

        // Add team activities
        recentTeams.forEach(item => {
            activities.push({
                type: 'team',
                icon: '👥',
                description: `Team created: ${item.name}`,
                timestamp: item.createdAt
            });
        });

        // Sort all activities by timestamp (most recent first)
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Limit to most recent 10 activities
        const limitedActivities = activities.slice(0, limit);

        res.json({
            success: true,
            data: limitedActivities
        });
    } catch (error) {
        console.error('Error fetching recent activities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recent activities',
            error: error.message
        });
    }
};

// @desc    Get equipment analytics
// @route   GET /api/stats/equipment-analytics
// @access  Private
exports.getEquipmentAnalytics = async (req, res) => {
    try {
        const Equipment = require('../models/Equipment');
        const MaintenanceRequest = require('../models/MaintenanceRequest');

        // Equipment by status
        const equipmentByStatus = await Equipment.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Equipment by category
        const equipmentByCategory = await Equipment.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    totalCost: { $sum: '$cost' },
                    avgMaintenanceCost: { $avg: '$totalMaintenanceCost' },
                },
            },
        ]);

        // Most maintained equipment
        const mostMaintained = await MaintenanceRequest.aggregate([
            {
                $group: {
                    _id: '$equipment',
                    requestCount: { $sum: 1 },
                    totalCost: { $sum: '$actualCost' },
                },
            },
            {
                $sort: { requestCount: -1 },
            },
            {
                $limit: 10,
            },
            {
                $lookup: {
                    from: 'equipments',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'equipmentInfo',
                },
            },
            {
                $unwind: '$equipmentInfo',
            },
            {
                $project: {
                    equipment: {
                        _id: '$equipmentInfo._id',
                        name: '$equipmentInfo.name',
                        serialNumber: '$equipmentInfo.serialNumber',
                    },
                    requestCount: 1,
                    totalCost: 1,
                },
            },
        ]);

        res.json({
            success: true,
            data: {
                byStatus: equipmentByStatus,
                byCategory: equipmentByCategory,
                mostMaintained,
            },
        });
    } catch (error) {
        console.error('Error fetching equipment analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching equipment analytics',
            error: error.message,
        });
    }
};

// @desc    Get request trends
// @route   GET /api/stats/request-trends
// @access  Private
exports.getRequestTrends = async (req, res) => {
    try {
        const MaintenanceRequest = require('../models/MaintenanceRequest');
        const months = parseInt(req.query.months) || 6;
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        const trends = await MaintenanceRequest.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        status: '$status',
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 },
            },
        ]);

        // Request by priority
        const byPriority = await MaintenanceRequest.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 },
                    avgResolutionTime: {
                        $avg: {
                            $subtract: ['$completedDate', '$createdAt'],
                        },
                    },
                },
            },
        ]);

        res.json({
            success: true,
            period: `Last ${months} months`,
            data: {
                trends,
                byPriority,
            },
        });
    } catch (error) {
        console.error('Error fetching request trends:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching request trends',
            error: error.message,
        });
    }
};

// @desc    Get cost analytics
// @route   GET /api/stats/cost-analytics
// @access  Private (Manager only)
exports.getCostAnalytics = async (req, res) => {
    try {
        const MaintenanceRequest = require('../models/MaintenanceRequest');
        const months = parseInt(req.query.months) || 12;
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        // Cost trends over time
        const costTrends = await MaintenanceRequest.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    actualCost: { $exists: true, $ne: null },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    totalCost: { $sum: '$actualCost' },
                    avgCost: { $avg: '$actualCost' },
                    requestCount: { $sum: 1 },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 },
            },
        ]);

        // Total costs
        const totalStats = await MaintenanceRequest.aggregate([
            {
                $match: {
                    actualCost: { $exists: true, $ne: null },
                },
            },
            {
                $group: {
                    _id: null,
                    totalCost: { $sum: '$actualCost' },
                    avgCost: { $avg: '$actualCost' },
                },
            },
        ]);

        res.json({
            success: true,
            period: `Last ${months} months`,
            data: {
                costTrends,
                totalStats: totalStats[0] || { totalCost: 0, avgCost: 0 },
            },
        });
    } catch (error) {
        console.error('Error fetching cost analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cost analytics',
            error: error.message,
        });
    }
};

// @desc    Get SLA compliance stats
// @route   GET /api/stats/sla-compliance
// @access  Private
exports.getSLACompliance = async (req, res) => {
    try {
        const MaintenanceRequest = require('../models/MaintenanceRequest');

        const slaStats = await MaintenanceRequest.aggregate([
            {
                $match: {
                    sla: { $exists: true, $ne: null },
                },
            },
            {
                $group: {
                    _id: '$slaStatus',
                    count: { $sum: 1 },
                },
            },
        ]);

        // SLA compliance by priority
        const byPriority = await MaintenanceRequest.aggregate([
            {
                $match: {
                    sla: { $exists: true, $ne: null },
                },
            },
            {
                $group: {
                    _id: {
                        priority: '$priority',
                        slaStatus: '$slaStatus',
                    },
                    count: { $sum: 1 },
                },
            },
        ]);

        const total = slaStats.reduce((sum, item) => sum + item.count, 0);
        const onTime = slaStats.find((item) => item._id === 'On Time')?.count || 0;
        const complianceRate = total > 0 ? ((onTime / total) * 100).toFixed(2) : 0;

        res.json({
            success: true,
            data: {
                summary: slaStats,
                byPriority,
                complianceRate: parseFloat(complianceRate),
                total,
            },
        });
    } catch (error) {
        console.error('Error fetching SLA compliance:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching SLA compliance',
            error: error.message,
        });
    }
};

// @desc    Get team performance metrics
// @route   GET /api/stats/team-performance
// @access  Private (Manager only)
exports.getTeamPerformance = async (req, res) => {
    try {
        const MaintenanceRequest = require('../models/MaintenanceRequest');
        const MaintenanceTeam = require('../models/MaintenanceTeam');

        const teamPerformance = await MaintenanceRequest.aggregate([
            {
                $match: {
                    status: { $in: ['Repaired', 'Scrap'] },
                },
            },
            {
                $group: {
                    _id: '$maintenanceTeam',
                    completedRequests: { $sum: 1 },
                    totalCost: { $sum: '$actualCost' },
                    avgCost: { $avg: '$actualCost' },
                    avgResolutionTime: {
                        $avg: {
                            $subtract: ['$completedDate', '$createdAt'],
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'maintenanceteams',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'teamInfo',
                },
            },
            {
                $unwind: '$teamInfo',
            },
            {
                $project: {
                    team: {
                        _id: '$teamInfo._id',
                        name: '$teamInfo.name',
                        type: '$teamInfo.type',
                    },
                    completedRequests: 1,
                    totalCost: 1,
                    avgCost: 1,
                    avgResolutionDays: {
                        $divide: ['$avgResolutionTime', 1000 * 60 * 60 * 24],
                    },
                },
            },
            {
                $sort: { completedRequests: -1 },
            },
        ]);

        res.json({
            success: true,
            data: teamPerformance,
        });
    } catch (error) {
        console.error('Error fetching team performance:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching team performance',
            error: error.message,
        });
    }
};
