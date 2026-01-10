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
