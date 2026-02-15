require('dotenv').config();
const mongoose = require('mongoose');
const TestActivity = require('./models/TestActivity');
const Equipment = require('./models/Equipment');
const User = require('./models/User');

const seedTestActivities = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get some equipment and users from the database
        const equipment = await Equipment.find().limit(5);
        const users = await User.find();

        if (equipment.length === 0) {
            console.log('❌ No equipment found in database. Please add equipment first.');
            process.exit(1);
        }

        if (users.length === 0) {
            console.log('❌ No users found in database. Please add users first.');
            process.exit(1);
        }

        console.log(`Found ${equipment.length} equipment items and ${users.length} users`);

        // Check if test activities already exist
        const existingTests = await TestActivity.countDocuments();
        if (existingTests > 0) {
            console.log(`\n⚠️  Found ${existingTests} existing test activities in database.`);
            console.log('Skipping seed to avoid duplicates.\n');
            process.exit(0);
        }

        // Create sample test activities
        const testActivities = [
            {
                equipment: equipment[0]._id,
                testType: 'Safety',
                testName: 'Fire Safety Inspection',
                testDescription: 'Annual fire safety compliance check for equipment',
                testedBy: users[0]._id,
                testDate: new Date('2026-02-10'),
                status: 'Passed',
                result: 'Pass',
                score: 95,
                parameters: [
                    { name: 'Fire Extinguisher', expectedValue: 'Present', actualValue: 'Present', result: 'Pass' },
                    { name: 'Emergency Stop', expectedValue: 'Functional', actualValue: 'Functional', result: 'Pass' },
                    { name: 'Safety Guards', expectedValue: 'Installed', actualValue: 'Installed', result: 'Pass' }
                ],
                observations: 'All safety systems operational. Minor wear on emergency stop button noted.',
                recommendations: 'Replace emergency stop button in next maintenance cycle.',
                priority: 'High',
                createdBy: users[0]._id
            },
            {
                equipment: equipment[1]._id,
                testType: 'Performance',
                testName: 'Load Testing - Maximum Capacity',
                testDescription: 'Testing equipment under maximum rated load conditions',
                testedBy: users[0]._id,
                testDate: new Date('2026-02-11'),
                status: 'Passed',
                result: 'Pass',
                score: 88,
                parameters: [
                    { name: 'Load Capacity', expectedValue: '100%', actualValue: '98%', result: 'Pass' },
                    { name: 'Temperature', expectedValue: '<80°C', actualValue: '75°C', result: 'Pass' },
                    { name: 'Vibration', expectedValue: 'Normal', actualValue: 'Slightly Elevated', result: 'Pass' }
                ],
                observations: 'Equipment performed well under load. Slight temperature elevation noted.',
                recommendations: 'Monitor temperature trends in future tests.',
                priority: 'Medium',
                createdBy: users[0]._id
            },
            {
                equipment: equipment[2]._id,
                testType: 'Functional',
                testName: 'Operational Functionality Check',
                testDescription: 'Comprehensive functional test of all operational modes',
                testedBy: users[0]._id,
                testDate: new Date('2026-02-08'),
                status: 'Failed',
                result: 'Fail',
                score: 62,
                parameters: [
                    { name: 'Power On/Off', expectedValue: 'Responsive', actualValue: 'Responsive', result: 'Pass' },
                    { name: 'Mode Selection', expectedValue: 'All Modes', actualValue: 'Mode 3 Stuck', result: 'Fail' },
                    { name: 'Display', expectedValue: 'Clear', actualValue: 'Flickering', result: 'Fail' }
                ],
                observations: 'Mode 3 selector is stuck. Display shows intermittent flickering.',
                recommendations: 'Schedule immediate repair for mode selector and display replacement.',
                priority: 'Critical',
                createdBy: users[0]._id
            },
            {
                equipment: equipment[0]._id,
                testType: 'Quality',
                testName: 'Output Quality Assessment',
                testDescription: 'Quality control test for production output standards',
                testedBy: users[0]._id,
                testDate: new Date('2026-02-12'),
                status: 'Passed',
                result: 'Pass',
                score: 92,
                parameters: [
                    { name: 'Dimensional Accuracy', expectedValue: '±0.1mm', actualValue: '±0.08mm', result: 'Pass' },
                    { name: 'Surface Finish', expectedValue: 'Smooth', actualValue: 'Smooth', result: 'Pass' },
                    { name: 'Defect Rate', expectedValue: '<2%', actualValue: '1.2%', result: 'Pass' }
                ],
                observations: 'Output quality meets all specifications. Excellent performance.',
                priority: 'Medium',
                createdBy: users[0]._id
            },
            {
                equipment: equipment[3]._id,
                testType: 'Operational',
                testName: 'Daily Operational Check',
                testDescription: 'Routine daily operational verification',
                testedBy: users[0]._id,
                testDate: new Date('2026-02-13'),
                status: 'In Progress',
                result: 'N/A',
                observations: 'Test currently in progress. Preliminary checks normal.',
                priority: 'Low',
                createdBy: users[0]._id
            },
            {
                equipment: equipment[4]._id,
                testType: 'Pre-Delivery',
                testName: 'Pre-Delivery Inspection',
                testDescription: 'Final inspection before equipment delivery to customer',
                testedBy: users[0]._id,
                testDate: new Date('2026-02-09'),
                status: 'Passed',
                result: 'Partial',
                score: 78,
                parameters: [
                    { name: 'Cosmetic Condition', expectedValue: 'Pristine', actualValue: 'Minor Scratches', result: 'Fail' },
                    { name: 'Functionality', expectedValue: '100%', actualValue: '100%', result: 'Pass' },
                    { name: 'Documentation', expectedValue: 'Complete', actualValue: 'Complete', result: 'Pass' }
                ],
                observations: 'Minor cosmetic imperfections found. All functions operational.',
                recommendations: 'Touch up paint on scratched areas before delivery.',
                priority: 'High',
                createdBy: users[0]._id
            },
            {
                equipment: equipment[1]._id,
                testType: 'Safety',
                testName: 'Electrical Safety Test',
                testDescription: 'Electrical safety and grounding verification',
                testedBy: users[0]._id,
                testDate: new Date('2026-02-07'),
                status: 'Passed',
                result: 'Pass',
                score: 100,
                parameters: [
                    { name: 'Ground Resistance', expectedValue: '<1Ω', actualValue: '0.3Ω', result: 'Pass' },
                    { name: 'Insulation', expectedValue: '>1MΩ', actualValue: '5.2MΩ', result: 'Pass' },
                    { name: 'Leakage Current', expectedValue: '<0.5mA', actualValue: '0.1mA', result: 'Pass' }
                ],
                observations: 'All electrical safety parameters excellent. No issues found.',
                priority: 'High',
                createdBy: users[0]._id
            },
            {
                equipment: equipment[2]._id,
                testType: 'Performance',
                testName: 'Speed and Accuracy Test',
                testDescription: 'Testing processing speed and accuracy metrics',
                testedBy: users[0]._id,
                testDate: new Date('2026-02-05'),
                status: 'Pending',
                result: 'N/A',
                observations: 'Test scheduled for next week.',
                nextTestDue: new Date('2026-02-20'),
                priority: 'Medium',
                createdBy: users[0]._id
            }
        ];

        const createdTests = await TestActivity.insertMany(testActivities);

        console.log('\n✅ Successfully created test activities:');
        console.log('='.repeat(70));
        createdTests.forEach((test, idx) => {
            console.log(`${idx + 1}. ${test.testName} - ${test.testType} - ${test.status} - ${test.result}`);
        });
        console.log('='.repeat(70));
        console.log(`\n📊 Total: ${createdTests.length} test activities created\n`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedTestActivities();
