require('dotenv').config();
const mongoose = require('mongoose');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const MaintenanceTeam = require('./models/MaintenanceTeam');
const User = require('./models/User');

const showContent = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to:', mongoose.connection.name, '\n');

        // Show Users
        const users = await User.find().select('name email role createdAt').lean();
        console.log('👥 USERS:', users.length);
        console.log('='.repeat(70));
        users.forEach(u => {
            console.log(`   ${u.name} (${u.email}) - ${u.role} - Created: ${new Date(u.createdAt).toLocaleDateString()}`);
        });

        // Show Equipment
        const equipment = await Equipment.find().select('name serialNumber category status createdAt').lean();
        console.log('\n\n🔧 EQUIPMENT:', equipment.length);
        console.log('='.repeat(70));
        equipment.slice(0, 10).forEach(e => {
            console.log(`   ${e.name} - ${e.serialNumber} - ${e.category} - ${e.status}`);
        });
        if (equipment.length > 10) console.log(`   ... and ${equipment.length - 10} more`);

        // Show Requests
        const requests = await MaintenanceRequest.find()
            .select('title status priority createdAt')
            .sort({ createdAt: -1 })
            .lean();
        console.log('\n\n📋 MAINTENANCE REQUESTS:', requests.length);
        console.log('='.repeat(70));
        requests.slice(0, 10).forEach(r => {
            console.log(`   ${r.title} - ${r.status} - ${r.priority} - ${new Date(r.createdAt).toLocaleDateString()}`);
        });
        if (requests.length > 10) console.log(`   ... and ${requests.length - 10} more`);

        // Show Teams
        const teams = await MaintenanceTeam.find().select('name type members createdAt').lean();
        console.log('\n\n👥 MAINTENANCE TEAMS:', teams.length);
        console.log('='.repeat(70));
        teams.forEach(t => {
            console.log(`   ${t.name} - ${t.type} - ${t.members?.length || 0} members`);
        });

        console.log('\n' + '='.repeat(70));
        console.log('✅ This is the data currently in your "gearguard" database');
        console.log('='.repeat(70));

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

showContent();
