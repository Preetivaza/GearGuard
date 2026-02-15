require('dotenv').config();
const mongoose = require('mongoose');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const MaintenanceTeam = require('./models/MaintenanceTeam');

const testDashboardStats = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        console.log('📊 FETCHING DASHBOARD STATS (Same as API):');
        console.log('='.repeat(60));

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

        // Get pending requests count (New status)
        const pendingRequests = await MaintenanceRequest.countDocuments({
            status: 'New'
        });

        // Get in-progress requests count
        const inProgressRequests = await MaintenanceRequest.countDocuments({
            status: 'In Progress'
        });

        // Get overdue requests count
        const now = new Date();
        const overdueRequests = await MaintenanceRequest.countDocuments({
            dueDate: { $lt: now },
            status: { $nin: ['Repaired', 'Scrap'] }
        });

        // Calculate average completion time
        const completedRequestsWithTimes = await MaintenanceRequest.aggregate([
            {
                $match: {
                    status: { $in: ['Repaired', 'Scrap'] },
                    completedDate: { $exists: true, $ne: null }
                }
            },
            {
                $project: {
                    completionTime: {
                        $divide: [
                            { $subtract: ['$completedDate', '$createdAt'] },
                            1000 * 60 * 60
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgCompletionTime: { $avg: '$completionTime' }
                }
            }
        ]);

        const avgCompletionTime = completedRequestsWithTimes.length > 0 
            ? Math.round(completedRequestsWithTimes[0].avgCompletionTime) 
            : 0;

        const stats = {
            totalEquipment,
            activeRequests,
            completedRequests,
            totalTeams,
            pendingRequests,
            inProgressRequests,
            overdueRequests,
            avgCompletionTime
        };

        console.log('\n✅ DASHBOARD STATS FROM DATABASE:');
        console.log(JSON.stringify(stats, null, 2));
        console.log('='.repeat(60));

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

testDashboardStats();
