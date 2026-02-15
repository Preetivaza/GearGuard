require('dotenv').config();
const mongoose = require('mongoose');

const checkConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('\n✅ MONGODB CONNECTION SUCCESSFUL!\n');
        console.log('📊 Database Details:');
        console.log('='.repeat(60));
        console.log(`Host: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);
        console.log(`Port: ${conn.connection.port || 'N/A (using SRV)'}`);
        console.log(`Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
        console.log('='.repeat(60));
        
        // Get collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log(`\n📁 Collections in database (${collections.length}):`);
        collections.forEach(col => {
            console.log(`   - ${col.name}`);
        });
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection Error:', error.message);
        process.exit(1);
    }
};

checkConnection();
