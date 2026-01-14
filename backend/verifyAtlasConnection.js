/**
 * MongoDB Atlas Connection Verification Script
 * 
 * This script helps you verify your MongoDB Atlas connection
 * and lists all collections in your database.
 * 
 * Usage:
 *   node verifyAtlasConnection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Import all models to ensure they're registered
const User = require('./models/User');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const MaintenanceTeam = require('./models/MaintenanceTeam');
const SLA = require('./models/SLA');
const SparePart = require('./models/SparePart');
const Budget = require('./models/Budget');
const Notification = require('./models/Notification');
const AuditLog = require('./models/AuditLog');
const Attachment = require('./models/Attachment');

const MODELS = {
    User,
    Equipment,
    MaintenanceRequest,
    MaintenanceTeam,
    SLA,
    SparePart,
    Budget,
    Notification,
    AuditLog,
    Attachment,
};

async function verifyConnection() {
    console.log('🔍 MongoDB Atlas Connection Verification\n');
    console.log('='.repeat(60));
    
    try {
        // 1. Check if MONGODB_URI is set
        if (!process.env.MONGODB_URI) {
            console.error('❌ ERROR: MONGODB_URI not found in environment variables');
            console.log('\n📝 Please ensure your .env file contains:');
            console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname\n');
            process.exit(1);
        }

        console.log('✅ Environment variable MONGODB_URI is set');
        
        // Extract database name from connection string
        const dbMatch = process.env.MONGODB_URI.match(/\.net\/([^?]+)/);
        const dbName = dbMatch ? dbMatch[1] : 'unknown';
        console.log(`📊 Target Database: ${dbName}`);
        
        // 2. Attempt connection
        console.log('\n🔌 Attempting to connect to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Successfully connected to MongoDB Atlas!');
        console.log(`   Host: ${mongoose.connection.host}`);
        console.log(`   Database: ${mongoose.connection.name}`);
        console.log(`   Port: ${mongoose.connection.port || 'default'}`);
        
        // 3. List all collections
        console.log('\n📋 Checking for existing collections...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        if (collections.length === 0) {
            console.log('⚠️  No collections found (database is empty)');
            console.log('   Collections will be created automatically when you insert data.');
        } else {
            console.log(`✅ Found ${collections.length} collection(s):\n`);
            collections.forEach((coll, index) => {
                console.log(`   ${index + 1}. ${coll.name}`);
            });
        }
        
        // 4. Check document counts for each collection
        console.log('\n📊 Document counts per collection:');
        console.log('-'.repeat(60));
        
        for (const [modelName, Model] of Object.entries(MODELS)) {
            try {
                const count = await Model.countDocuments();
                const collectionName = Model.collection.name;
                const status = count > 0 ? '✅' : '⚪';
                console.log(`   ${status} ${collectionName.padEnd(25)} : ${count} document(s)`);
            } catch (error) {
                console.log(`   ❌ ${modelName.padEnd(25)} : Error - ${error.message}`);
            }
        }
        
        // 5. Verify indexes
        console.log('\n🔑 Verifying indexes...');
        console.log('-'.repeat(60));
        
        for (const [modelName, Model] of Object.entries(MODELS)) {
            try {
                const indexes = await Model.collection.getIndexes();
                const indexCount = Object.keys(indexes).length;
                console.log(`   ${Model.collection.name.padEnd(25)} : ${indexCount} index(es)`);
            } catch (error) {
                console.log(`   ❌ ${modelName.padEnd(25)} : Could not retrieve indexes`);
            }
        }
        
        // 6. Database statistics
        console.log('\n💾 Database Statistics:');
        console.log('-'.repeat(60));
        try {
            const stats = await mongoose.connection.db.stats();
            console.log(`   Collections: ${stats.collections}`);
            console.log(`   Indexes: ${stats.indexes}`);
            console.log(`   Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
        } catch (error) {
            console.log(`   ⚠️  Could not retrieve database stats: ${error.message}`);
        }
        
        // 7. Expected collections vs actual
        console.log('\n🎯 Expected Collections:');
        console.log('-'.repeat(60));
        const expectedCollections = Object.keys(MODELS).map(name => 
            MODELS[name].collection.name
        );
        
        expectedCollections.forEach(collName => {
            const exists = collections.some(c => c.name === collName);
            const status = exists ? '✅ Exists' : '⚪ Will be created on first insert';
            console.log(`   ${collName.padEnd(25)} : ${status}`);
        });
        
        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('✅ CONNECTION VERIFICATION COMPLETE!');
        console.log('='.repeat(60));
        
        console.log('\n📝 Next Steps:');
        if (collections.length === 0) {
            console.log('   1. Collections are empty - run seed script to populate:');
            console.log('      npm run seed  (or: node seed.js)');
            console.log('   2. Or start your backend server and use the API endpoints');
            console.log('   3. Collections will be created automatically on first insert');
        } else {
            console.log('   ✅ Your database is ready to use!');
            console.log('   🚀 Start your server: npm start');
        }
        
    } catch (error) {
        console.error('\n❌ CONNECTION FAILED!');
        console.error('='.repeat(60));
        console.error(`Error: ${error.message}\n`);
        
        // Provide helpful troubleshooting tips
        console.log('🔧 Troubleshooting Tips:');
        console.log('-'.repeat(60));
        
        if (error.message.includes('bad auth')) {
            console.log('   ❌ Authentication failed');
            console.log('   → Check your MongoDB username and password');
            console.log('   → Ensure special characters in password are URL-encoded');
            console.log('   → Verify the database user exists in Atlas');
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('timed out')) {
            console.log('   ❌ Cannot reach MongoDB cluster');
            console.log('   → Check your internet connection');
            console.log('   → Verify cluster address is correct');
            console.log('   → Ensure your IP is whitelisted in Atlas Network Access');
            console.log('      (Add 0.0.0.0/0 to allow from anywhere for testing)');
        } else if (error.message.includes('not authorized')) {
            console.log('   ❌ Authorization error');
            console.log('   → Ensure user has read/write permissions on the database');
            console.log('   → Check database name in connection string');
        } else {
            console.log('   → Check MONGODB_URI format in .env file');
            console.log('   → Expected format: mongodb+srv://user:pass@cluster.mongodb.net/dbname');
        }
        
        console.log('\n📚 For more help, see:');
        console.log('   - MongoDB Atlas Setup Guide (in artifacts)');
        console.log('   - https://www.mongodb.com/docs/atlas/troubleshoot-connection/\n');
        
        process.exit(1);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('\n🔌 Connection closed.\n');
    }
}

// Run verification
verifyConnection();
