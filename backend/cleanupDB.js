require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const cleanupDatabase = async () => {
    try {
        await connectDB();

        console.log('🧹 Starting database cleanup...\n');

        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        // Check if "teams" collection exists
        if (collectionNames.includes('teams')) {
            console.log('❌ Found duplicate "teams" collection');

            // Check if it has any data
            const count = await mongoose.connection.db.collection('teams').countDocuments();
            console.log(`   Contains ${count} documents`);

            if (count > 0) {
                console.log('\n⚠️  WARNING: This collection contains data!');
                console.log('   Make sure this data is not needed before deleting.');
                console.log('   The app uses "maintenanceteams" collection instead.\n');
            }

            // Drop the collection
            await mongoose.connection.db.dropCollection('teams');
            console.log('✅ Dropped "teams" collection successfully!\n');
        } else {
            console.log('✅ No duplicate "teams" collection found. Database is clean!\n');
        }

        // Show final collection list
        const finalCollections = await mongoose.connection.db.listCollections().toArray();
        console.log('📊 Current collections:');
        for (const col of finalCollections) {
            const docCount = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`  - ${col.name}: ${docCount} documents`);
        }

        console.log('\n✅ Database cleanup completed!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

cleanupDatabase();
