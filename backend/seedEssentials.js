require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import only essential models
const User = require('./models/User');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const MaintenanceTeam = require('./models/MaintenanceTeam');
const SparePart = require('./models/SparePart');
const Notification = require('./models/Notification');

const seedEssentialData = async () => {
    try {
        await connectDB();
        console.log('\n🌱 Seeding Essential Collections Only...\n');

        // Get existing core data
        const users = await User.find();
        const equipment = await Equipment.find();
        const teams = await MaintenanceTeam.find();
        const requests = await MaintenanceRequest.find();

        if (!users.length) {
            console.log('❌ Please run main seed first: node seed.js');
            process.exit(1);
        }

        const manager = users.find(u => u.role === 'Manager');
        const technician = users.find(u => u.role === 'Technician');

        // ==================== SPARE PARTS ====================
        console.log('🔧 Seeding Spare Parts...');
        const existingParts = await SparePart.countDocuments();
        
        if (existingParts === 0) {
            const spareParts = await SparePart.create([
                {
                    name: 'Hydraulic Oil Filter - Heavy Duty',
                    sku: 'HYD-FILTER-001',
                    category: 'Mechanical',
                    description: 'High-performance hydraulic oil filter for press systems',
                    compatibleEquipment: equipment.slice(0, 3).map(e => e._id),
                    quantity: 25,
                    unit: 'pcs',
                    minimumStock: 10,
                    unitPrice: 45.50,
                    location: 'Warehouse A - Shelf 12',
                    supplier: {
                        name: 'Industrial Supply Co.',
                        contact: '+1-555-0200',
                        email: 'sales@industrialsupply.com'
                    },
                    createdBy: manager._id
                },
                {
                    name: 'Cooling Fan Assembly',
                    sku: 'FAN-ASSY-202',
                    category: 'Electronics',
                    description: 'Replacement cooling fan for electronics',
                    compatibleEquipment: [equipment[4]?._id, equipment[5]?._id],
                    quantity: 8,
                    unit: 'pcs',
                    minimumStock: 5,
                    unitPrice: 125.00,
                    location: 'Electronics Storage - Bin 5',
                    supplier: {
                        name: 'Electronics Warehouse',
                        email: 'parts@electrowarehouse.com'
                    },
                    createdBy: manager._id
                },
                {
                    name: 'Precision Bearing Set',
                    sku: 'BEARING-SET-450',
                    category: 'Mechanical',
                    description: 'Precision bearings for machinery',
                    compatibleEquipment: [equipment[0]?._id],
                    quantity: 12,
                    unit: 'sets',
                    minimumStock: 6,
                    unitPrice: 285.75,
                    location: 'Precision Parts - Cabinet 3',
                    supplier: {
                        name: 'Bearing Specialists Inc.',
                        email: 'orders@bearingspec.com'
                    },
                    createdBy: manager._id
                },
                {
                    name: 'Industrial Lubricant',
                    sku: 'LUB-IND-100',
                    category: 'Consumable',
                    description: 'Heavy-duty industrial lubricant oil',
                    compatibleEquipment: equipment.slice(0, 5).map(e => e._id),
                    quantity: 50,
                    unit: 'liters',
                    minimumStock: 20,
                    unitPrice: 15.00,
                    location: 'Chemicals Storage - Section C',
                    supplier: {
                        name: 'Industrial Chemicals Ltd.',
                        email: 'sales@indchem.com'
                    },
                    createdBy: manager._id
                },
                {
                    name: 'Safety Gloves - Heavy Duty',
                    sku: 'SAFETY-GLOVE-XL',
                    category: 'Safety',
                    description: 'Cut-resistant safety gloves for technicians',
                    quantity: 100,
                    unit: 'pairs',
                    minimumStock: 30,
                    unitPrice: 8.50,
                    location: 'Safety Equipment - Locker 2',
                    supplier: {
                        name: 'Safety First Supplies',
                        email: 'order@safetyfirst.com'
                    },
                    createdBy: manager._id
                }
            ]);
            console.log(`✅ Created ${spareParts.length} spare parts`);
        } else {
            console.log(`⚠️  Spare parts already exist (${existingParts} items)`);
        }

        // ==================== NOTIFICATIONS ====================
        console.log('\n🔔 Seeding Notifications...');
        const existingNotifications = await Notification.countDocuments();
        
        if (existingNotifications === 0  && requests.length > 0) {
            const notifications = await Notification.create([
                {
                    user: technician._id,
                    type: 'request_assigned',
                    title: 'New Maintenance Request Assigned',
                    message: `You have been assigned to: ${requests[0]?.title}`,
                    relatedRequest: requests[0]?._id,
                    isRead: false
                },
                {
                    user: manager._id,
                    type: 'request_overdue',
                    title: 'Overdue Maintenance Alert',
                    message: `Request "${requests[1]?.title}" requires attention`,
                    relatedRequest: requests[1]?._id,
                    isRead: false
                },
                {
                    user: technician._id,
                    type: 'status_change',
                    title: 'Request Status Updated',
                    message: `${requests[2]?.title} has been updated`,
                    relatedRequest: requests[2]?._id,
                    isRead: true
                },
                {
                    user: manager._id,
                    type: 'low_stock',
                    title: 'Low Stock Alert',
                    message: 'Some spare parts are below minimum stock level',
                    isRead: false
                },
                {
                    user: users.find(u => u.role === 'User')?._id,
                    type: 'request_completed',
                    title: 'Maintenance Request Completed',
                    message: 'Your maintenance request has been completed',
                    isRead: false
                }
            ]);
            console.log(`✅ Created ${notifications.length} notifications`);
        } else {
            console.log(`⚠️  Notifications already exist (${existingNotifications} items)`);
        }

        // ==================== SUMMARY ====================
        console.log('\n' + '='.repeat(60));
        console.log('🎉 ESSENTIAL DATA SEEDED SUCCESSFULLY!');
        console.log('='.repeat(60));

        const finalCounts = {
            users: await User.countDocuments(),
            equipment: await Equipment.countDocuments(),
            teams: await MaintenanceTeam.countDocuments(),
            requests: await MaintenanceRequest.countDocuments(),
            spareParts: await SparePart.countDocuments(),
            notifications: await Notification.countDocuments()
        };

        console.log('\n📊 Database Summary (Essential Collections):');
        console.log(`   👥 Users: ${finalCounts.users}`);
        console.log(`   ⚙️  Equipment: ${finalCounts.equipment}`);
        console.log(`   🔧 Teams: ${finalCounts.teams}`);
        console.log(`   📋 Maintenance Requests: ${finalCounts.requests}`);
        console.log(`   🔩 Spare Parts: ${finalCounts.spareParts}`);
        console.log(`   🔔 Notifications: ${finalCounts.notifications}`);

        const total = Object.values(finalCounts).reduce((a, b) => a + b, 0);
        console.log(`\n   📦 TOTAL DOCUMENTS: ${total}`);

        console.log('\n✅ Your application is ready with essential data!');
        console.log('🚀 Start using: http://localhost:5173\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedEssentialData();
