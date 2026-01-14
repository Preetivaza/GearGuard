require('dotenv').config();
const mongoose = require('mongoose');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');

const checkDatabaseRecords = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB Atlas\n');
        console.log('='.repeat(60));
        console.log('📊 MAINTENANCE REQUESTS IN DATABASE');
        console.log('='.repeat(60));

        // Get all maintenance requests
        const allRequests = await MaintenanceRequest.find({})
            .populate('equipment', 'name')
            .sort({ createdAt: -1 });

        console.log(`\n📋 Total Requests: ${allRequests.length}\n`);

        // Group by status
        const statusGroups = {
            'New': [],
            'In Progress': [],
            'Repaired': [],
            'Scrap': []
        };

        allRequests.forEach(req => {
            if (statusGroups[req.status]) {
                statusGroups[req.status].push(req);
            }
        });

        // Display each status group
        Object.keys(statusGroups).forEach(status => {
            const requests = statusGroups[status];
            console.log(`\n${status.toUpperCase()} (${requests.length} requests)`);
            console.log('-'.repeat(60));
            
            if (requests.length === 0) {
                console.log('  No requests');
            } else {
                requests.forEach((req, index) => {
                    console.log(`  ${index + 1}. ${req.title}`);
                    console.log(`     Equipment: ${req.equipment?.name || 'N/A'}`);
                    console.log(`     Priority: ${req.priority}`);
                    console.log(`     Type: ${req.requestType}`);
                    console.log(`     ID: ${req._id}`);
                    console.log('');
                });
            }
        });

        console.log('='.repeat(60));
        console.log('✅ Database query completed successfully!');
        console.log('='.repeat(60));

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

checkDatabaseRecords();
