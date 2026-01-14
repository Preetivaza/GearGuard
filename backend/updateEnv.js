/**
 * Update .env file with MongoDB Atlas connection string
 * 
 * This script helps you update your .env file with the correct MongoDB URI
 * 
 * Usage:
 *   node updateEnv.js YOUR_PASSWORD
 * 
 * Example:
 *   node updateEnv.js MySecurePass123
 */

const fs = require('fs');
const path = require('path');

// Get password from command line argument
const password = process.argv[2];

if (!password) {
    console.error('❌ ERROR: Please provide your database password as an argument');
    console.log('\nUsage:');
    console.log('  node updateEnv.js YOUR_PASSWORD\n');
    console.log('Example:');
    console.log('  node updateEnv.js MySecurePass123\n');
    process.exit(1);
}

// URL encode the password
function urlEncodePassword(pwd) {
    return encodeURIComponent(pwd);
}

const encodedPassword = urlEncodePassword(password);

// Build the connection string
const connectionString = `mongodb+srv://preetivaza_db_user:${encodedPassword}@cluster0.tqyzbtz.mongodb.net/gearguard?retryWrites=true&w=majority&appName=Cluster0`;

// Path to .env file
const envPath = path.join(__dirname, '.env');

// Read existing .env file
let envContent = '';
try {
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }
} catch (error) {
    console.log('⚠️  No existing .env file found, will create a new one');
}

// Update or add MONGODB_URI
const mongoDbUriRegex = /^MONGODB_URI=.*/m;

if (mongoDbUriRegex.test(envContent)) {
    // Replace existing MONGODB_URI
    envContent = envContent.replace(mongoDbUriRegex, `MONGODB_URI=${connectionString}`);
    console.log('✅ Updated existing MONGODB_URI in .env file');
} else {
    // Add new MONGODB_URI
    if (envContent && !envContent.endsWith('\n')) {
        envContent += '\n';
    }
    envContent += `\n# MongoDB Configuration\nMONGODB_URI=${connectionString}\n`;
    console.log('✅ Added MONGODB_URI to .env file');
}

// Write updated content back to .env
try {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('\n📝 .env file updated successfully!');
    console.log('\n🔗 Connection String:');
    console.log(`   ${connectionString.substring(0, 50)}...`);
    console.log('\n📊 Database Details:');
    console.log('   Database Name: gearguard');
    console.log('   User: preetivaza_db_user');
    console.log('   Cluster: cluster0.tqyzbtz.mongodb.net');
    console.log('\n🚀 Next Steps:');
    console.log('   1. Test connection: node verifyAtlasConnection.js');
    console.log('   2. Start your server: npm start\n');
} catch (error) {
    console.error('❌ ERROR: Failed to write .env file');
    console.error(`   ${error.message}\n`);
    process.exit(1);
}
