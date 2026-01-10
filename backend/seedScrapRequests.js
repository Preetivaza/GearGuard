require('dotenv').config();
const mongoose = require('mongoose');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const User = require('./models/User');

const seedScrapRequests = async () => {
    try {
        // Connect to database (same way as in config/db.js)
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Check if scrap requests already exist
        const existingScrap = await MaintenanceRequest.find({ status: 'Scrap' });

        if (existingScrap.length > 0) {
            console.log(`✅ Found ${existingScrap.length} existing scrap requests:`);
            existingScrap.forEach((req, i) => {
                console.log(`   ${i + 1}. ${req.title} (Priority: ${req.priority})`);
            });
            await mongoose.connection.close();
            process.exit(0);
        }

        console.log('❌ No scrap requests found. Creating dummy scrap requests...');

        // Get first user and equipment
        const user = await User.findOne();
        const equipment = await Equipment.findOne();
        const MaintenanceTeam = require('./models/MaintenanceTeam');
        const team = await MaintenanceTeam.findOne();

        if (!user) {
            console.log('❌ No users found in database. Please create a user first.');
            await mongoose.connection.close();
            process.exit(1);
        }

        if (!equipment) {
            console.log('❌ No equipment found in database. Please create equipment first.');
            await mongoose.connection.close();
            process.exit(1);
        }

        if (!team) {
            console.log('❌ No maintenance teams found in database. Please create a team first.');
            await mongoose.connection.close();
            process.exit(1);
        }

        console.log(`✅ Using user: ${user.name} (${user.email})`);
        console.log(`✅ Using equipment: ${equipment.name}`);
        console.log(`✅ Using team: ${team.name}`);

        // Create scrap requests
        const scrapRequests = await MaintenanceRequest.insertMany([
            {
                title: 'Motor Burnt Out - Beyond Repair',
                description: 'Motor overheated and burnt out completely. Cannot be repaired. Equipment needs replacement.',
                equipment: equipment._id,
                requestType: 'Corrective',
                status: 'Scrap',
                priority: 'Critical',
                createdBy: user._id,
                maintenanceTeam: team._id
            },
            {
                title: 'Hydraulic System Failure',
                description: 'Complete hydraulic system failure. Cost of repair exceeds replacement value.',
                equipment: equipment._id,
                requestType: 'Corrective',
                status: 'Scrap',
                priority: 'High',
                createdBy: user._id,
                maintenanceTeam: team._id
            },
            {
                title: 'Structural Damage - Unrepairable',
                description: 'Major structural damage from accident. Equipment declared as scrap.',
                equipment: equipment._id,
                requestType: 'Corrective',
                status: 'Scrap',
                priority: 'High',
                createdBy: user._id,
                maintenanceTeam: team._id
            }
        ]);

        console.log(`\n✅ Successfully created ${scrapRequests.length} scrap requests:`);
        scrapRequests.forEach((req, i) => {
            console.log(`   ${i + 1}. ${req.title} (Priority: ${req.priority})`);
        });

        console.log('\n✅ Database seeding completed!');
        console.log('💡 Refresh your Kanban board and Dashboard to see the scrap requests.');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Run the seed function
seedScrapRequests();
