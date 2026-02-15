require('dotenv').config();
const mongoose = require('mongoose');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const MaintenanceTeam = require('./models/MaintenanceTeam');
const User = require('./models/User');

const checkDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const equipmentCount = await Equipment.countDocuments();
        const requestCount = await MaintenanceRequest.countDocuments();
        const teamCount = await MaintenanceTeam.countDocuments();
        const userCount = await User.countDocuments();

        console.log('📊 DATABASE SUMMARY:');
        console.log('='.repeat(50));
        console.log(`Total Equipment: ${equipmentCount}`);
        console.log(`Total Requests: ${requestCount}`);
        console.log(`Total Teams: ${teamCount}`);
        console.log(`Total Users: ${userCount}`);
        console.log('='.repeat(50));

        // Get requests by status
        const newRequests = await MaintenanceRequest.countDocuments({ status: 'New' });
        const inProgressRequests = await MaintenanceRequest.countDocuments({ status: 'In Progress' });
        const repairedRequests = await MaintenanceRequest.countDocuments({ status: 'Repaired' });
        const scrapRequests = await MaintenanceRequest.countDocuments({ status: 'Scrap' });

        console.log('\n📋 REQUESTS BY STATUS:');
        console.log('='.repeat(50));
        console.log(`New: ${newRequests}`);
        console.log(`In Progress: ${inProgressRequests}`);
        console.log(`Repaired: ${repairedRequests}`);
        console.log(`Scrap: ${scrapRequests}`);
        console.log('='.repeat(50));

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkDatabase();
