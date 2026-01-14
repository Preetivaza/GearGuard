require('dotenv').config();
const mongoose = require('mongoose');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');

const checkScrapRequests = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('\n✅ Connected to MongoDB Atlas - Database: gearguard\n');
        
        // Get scrap requests
        const scrapRequests = await MaintenanceRequest.find({ status: 'Scrap' })
            .populate('equipment', 'name')
            .lean();

        console.log('🗑️ SCRAP REQUESTS IN DATABASE:');
        console.log('===============================\n');
        console.log(`Total Scrap Requests: ${scrapRequests.length}\n`);

        scrapRequests.forEach((req, i) => {
            console.log(`${i + 1}. ${req.title}`);
            console.log(`   Equipment: ${req.equipment?.name || 'N/A'}`);
            console.log(`   Priority: ${req.priority}`);
            console.log(`   Database ID: ${req._id}`);
            console.log(`   Created: ${new Date(req.createdAt).toLocaleDateString()}\n`);
        });

        // Get counts for all statuses
        const allCounts = await MaintenanceRequest.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        console.log('\n📊 ALL MAINTENANCE REQUESTS BY STATUS:');
        console.log('=====================================');
        allCounts.forEach(item => {
            console.log(`${item._id}: ${item.count} requests`);
        });

        const total = await MaintenanceRequest.countDocuments();
        console.log(`\nTotal in Database: ${total} requests\n`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkScrapRequests();
