require('dotenv').config();
const mongoose = require('mongoose');

const showSummary = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        
        console.log('\nDatabase: ' + mongoose.connection.name);
        console.log('\nCollections and Record Counts:');
        
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`${col.name}: ${count} records`);
            
            // Show sample data for each collection
            if (count > 0) {
                const samples = await db.collection(col.name).find().limit(3).toArray();
                samples.forEach((sample, idx) => {
                    const name = sample.name || sample.title || sample.email || sample._id;
                    const created = sample.createdAt ? new Date(sample.createdAt).toLocaleDateString() : 'N/A';
                    console.log(`  ${idx + 1}. ${name} (Created: ${created})`);
                });
            }
        }
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

showSummary();
