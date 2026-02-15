require('dotenv').config();

console.log('\n📊 MONGODB CONNECTION DETAILS:');
console.log('='.repeat(70));

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.log('❌ No MONGODB_URI found in environment variables!');
    process.exit(1);
}

// Parse the MongoDB URI to extract details
try {
    const url = new URL(mongoURI);
    
    console.log('\n🔗 Connection Information:');
    console.log(`   Protocol: ${url.protocol}`);
    console.log(`   Host: ${url.hostname}`);
    
    // Extract database name from pathname
    const dbName = url.pathname.split('/')[1].split('?')[0];
    console.log(`   Database Name: ${dbName}`);
    
    // Extract cluster information if it's MongoDB Atlas
    if (url.hostname.includes('mongodb.net')) {
        const clusterInfo = url.hostname.split('.')[0];
        console.log(`   Cluster: ${clusterInfo}`);
        console.log(`   Provider: MongoDB Atlas (Cloud)`);
    } else {
        console.log(`   Provider: Self-hosted/Local MongoDB`);
    }
    
    console.log('\n📁 Full Connection String (sanitized):');
    // Show URI but hide password
    const sanitizedURI = mongoURI.replace(/:([^@]+)@/, ':****@');
    console.log(`   ${sanitizedURI}`);
    
} catch (error) {
    console.log('❌ Error parsing MongoDB URI:', error.message);
}

console.log('\n' + '='.repeat(70));
