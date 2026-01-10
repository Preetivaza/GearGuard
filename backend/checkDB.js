require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const checkCollections = async () => {
    try {
        await connectDB();

        console.log('📊 Checking MongoDB collections...\n');

        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        console.log('Found collections:');
        collectionNames.forEach(name => {
            console.log(`  - ${name}`);
        });

        console.log('\n✅ Expected collections:');
        console.log('  - users');
        console.log('  - maintenanceteams');
        console.log('  - equipment');
        console.log('  - maintenancerequests');

        // Check for unexpected collections
        const expectedCollections = ['users', 'maintenanceteams', 'equipment', 'maintenancerequests'];
        const unexpectedCollections = collectionNames.filter(name => !expectedCollections.includes(name));

        if (unexpectedCollections.length > 0) {
            console.log('\n⚠️  Unexpected collections found:');
            unexpectedCollections.forEach(name => {
                console.log(`  - ${name} (should be removed)`);
            });

            // Special check for "teams" collection
            if (collectionNames.includes('teams')) {
                console.log('\n❌ Found duplicate "teams" collection!');
                console.log('   This should be removed. The app uses "maintenanceteams" instead.');
                console.log('\n   To remove it, run: node cleanupDB.js');
            }
        } else {
            console.log('\n✅ Database structure is correct!');
        }

        // Count documents in each collection
        console.log('\n📈 Document counts:');
        for (const name of collectionNames) {
            const count = await mongoose.connection.db.collection(name).countDocuments();
            console.log(`  - ${name}: ${count} documents`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkCollections();
