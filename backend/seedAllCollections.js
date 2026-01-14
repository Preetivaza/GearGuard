require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import all models
const User = require('./models/User');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const MaintenanceTeam = require('./models/MaintenanceTeam');
const SparePart = require('./models/SparePart');
const Budget = require('./models/Budget');
const SLA = require('./models/SLA');
const Notification = require('./models/Notification');
const AuditLog = require('./models/AuditLog');
const Attachment = require('./models/Attachment');

const seedAllCollections = async () => {
    try {
        await connectDB();
        console.log('\n🌱 Starting comprehensive database seeding...\n');

        // Get existing data
        const users = await User.find();
        const equipment = await Equipment.find();
        const teams = await MaintenanceTeam.find();
        const requests = await MaintenanceRequest.find();

        if (!users.length || !equipment.length || !teams.length) {
            console.log('❌ Please run the main seed script first: node seed.js');
            process.exit(1);
        }

        const manager = users.find(u => u.role === 'Manager');
        const technician = users.find(u => u.role === 'Technician');

        // ==================== SPARE PARTS ====================
        try {
            console.log('🔧 Seeding Spare Parts...');
            const existingParts = await SparePart.countDocuments();
            if (existingParts === 0) {
                await SparePart.insertMany([
                    {
                        name: 'Hydraulic Oil Filter',
                        sku: 'HYD-FILTER-001',
                        category: 'Mechanical',
                        description: 'High-performance hydraulic oil filter compatible with press systems',
                        compatibleEquipment: [equipment[1]?._id],
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
                        name: 'VFD Cooling Fan',
                        sku: 'VFD-FAN-202',
                        category: 'Electronics',
                        description: 'Replacement cooling fan for ABB VFD units',
                        compatibleEquipment: [equipment[4]?._id],
                        quantity: 8,
                        unit: 'pcs',
                        minimumStock: 5,
                        unitPrice: 125.00,
                        location: 'Electronics Storage - Bin 5',
                        supplier: {
                            name: 'ABB Authorized Distributor',
                            contact: '+1-555-0201',
                            email: 'parts@abbdist.com'
                        },
                        createdBy: manager._id
                    },
                    {
                        name: 'CNC Spindle Bearings',
                        sku: 'CNC-BRG-450',
                        category: 'Mechanical',
                        description: 'Precision bearings for CNC machine spindles',
                        compatibleEquipment: [equipment[0]?._id],
                        quantity: 12,
                        unit: 'pcs',
                        minimumStock: 6,
                        unitPrice: 285.75,
                        location: 'Precision Parts - Cabinet 3',
                        supplier: {
                            name: 'Bearing Specialists Inc.',
                            contact: '+1-555-0202',
                            email: 'orders@bearingspec.com'
                        },
                        createdBy: manager._id
                    },
                    {
                        name: 'Server RAM Module 16GB',
                        sku: 'RAM-DDR4-16G',
                        category: 'Electronics',
                        description: '16GB DDR4 RAM module for server upgrades',
                        compatibleEquipment: [equipment[5]?._id],
                        quantity: 15,
                        unit: 'pcs',
                        minimumStock: 8,
                        unitPrice: 95.00,
                        location: 'IT Storage - Shelf 2',
                        supplier: {
                            name: 'Tech Supply Hub',
                            contact: '+1-555-0203',
                            email: 'support@techsupply.com'
                        },
                        createdBy: manager._id
                    },
                    {
                        name: 'HVAC Compressor Belt',
                        sku: 'HVAC-BELT-88',
                        category: 'Mechanical',
                        description: 'Heavy-duty belt for HVAC compressor units',
                        compatibleEquipment: [equipment[10]?._id],
                        quantity: 6,
                        unit: 'pcs',
                        minimumStock: 4,
                        unitPrice: 32.50,
                        location: 'HVAC Storage - Bin 8',
                        supplier: {
                            name: 'HVAC Parts Direct',
                            contact: '+1-555-0204',
                            email: 'sales@hvacparts.com'
                        },
                        createdBy: manager._id
                    }
                ]);
                console.log('✅ Created 5 spare parts');
            } else {
                console.log(`⚠️  Spare parts already exist (${existingParts} items)`);
            }
        } catch (error) {
            console.error('❌ Error seeding spare parts:', error.message);
        }

        // ==================== BUDGETS ====================
        try {
            console.log('\n💰 Seeding Budgets...');
            const existingBudgets = await Budget.countDocuments();
            if (existingBudgets === 0) {
                await Budget.insertMany([
                    {
                        name: 'Q1 2026 Manufacturing Budget',
                        department: 'Manufacturing',
                        fiscalYear: 2026,
                        period: 'Quarterly',
                        startDate: new Date('2026-01-01'),
                        endDate: new Date('2026-03-31'),
                        allocatedAmount: 50000,
                        spentAmount: 12450,
                        categories: [
                            { name: 'Preventive Maintenance', allocated: 30000, spent: 8450 },
                            { name: 'Spare Parts', allocated: 15000, spent: 3500 },
                            { name: 'Emergency Repairs', allocated:5000, spent: 500 }
                        ],
                        createdBy: manager._id
                    },
                    {
                        name: 'Q1 2026 IT Department Budget',
                        department: 'IT',
                        fiscalYear: 2026,
                        period: 'Quarterly',
                        startDate: new Date('2026-01-01'),
                        endDate: new Date('2026-03-31'),
                        allocatedAmount: 30000,
                        spentAmount: 8750,
                        categories: [
                            { name: 'Equipment Upgrades', allocated: 18000, spent: 5250 },
                            { name: 'Software Licenses', allocated: 8000, spent: 2500 },
                            { name: 'Maintenance', allocated: 4000, spent: 1000 }
                        ],
                        createdBy: manager._id
                    },
                    {
                        name: 'Q1 2026 Facilities Budget',
                        department: 'Facilities',
                        fiscalYear: 2026,
                        period: 'Quarterly',
                        startDate: new Date('2026-01-01'),
                        endDate: new Date('2026-03-31'),
                        allocatedAmount: 25000,
                        spentAmount: 15320,
                        categories: [
                            { name: 'Corrective Maintenance', allocated: 15000, spent: 10320 },
                            { name: 'Building Repairs', allocated: 7000, spent: 3500 },
                            { name: 'HVAC Systems', allocated: 3000, spent: 1500 }
                        ],
                        createdBy: manager._id
                    },
                    {
                        name: 'FY 2026 Annual Maintenance Budget',
                        department: 'Manufacturing',
                        fiscalYear: 2026,
                        period: 'Yearly',
                        startDate: new Date('2026-01-01'),
                        endDate: new Date('2026-12-31'),
                        allocatedAmount: 200000,
                        spentAmount: 35000,
                        categories: [
                            { name: 'Preventive Maintenance', allocated: 120000, spent: 25000 },
                            { name: 'Equipment Replacement', allocated: 50000, spent: 7000 },
                            { name: 'Emergency Fund', allocated: 30000, spent: 3000 }
                        ],
                        createdBy: manager._id
                    }
                ]);
                console.log('✅ Created 4 budget entries');
            } else {
                console.log(`⚠️  Budgets already exist (${existingBudgets} entries)`);
            }
        } catch (error) {
            console.error('❌ Error seeding budgets:', error.message);
        }

        // ==================== SLAs ====================
        try {
            console.log('\n📋 Seeding SLAs...');
            const existingSLAs = await SLA.countDocuments();
            if (existingSLAs === 0) {
                await SLA.insertMany([
                    {
                        name: 'Critical Equipment Response',
                        priority: 'Critical',
                        responseTime: 1,
                        resolutionTime: 4,
                        description: 'For critical equipment failures that halt production',
                        isActive: true,
                        createdBy: manager._id
                    },
                    {
                        name: 'High Priority Support',
                        priority: 'High',
                        responseTime: 2,
                        resolutionTime: 8,
                        description: 'For high priority maintenance requests affecting operations',
                        isActive: true,
                        createdBy: manager._id
                    },
                    {
                        name: 'Standard Maintenance',
                        priority: 'Medium',
                        responseTime: 4,
                        resolutionTime: 24,
                        description: 'Standard maintenance and repair work',
                        isActive: true,
                        createdBy: manager._id
                    },
                    {
                        name: 'Routine Preventive',
                        priority: 'Low',
                        responseTime: 24,
                        resolutionTime: 72,
                        description: 'Routine preventive maintenance and inspections',
                        isActive: true,
                        createdBy: manager._id
                    }
                ]);
                console.log('✅ Created 4 SLA policies');
            } else {
                console.log(`⚠️  SLAs already exist (${existingSLAs} policies)`);
            }
        } catch (error) {
            console.error('❌ Error seeding SLAs:', error.message);
        }

        // ==================== NOTIFICATIONS ====================
        console.log('\n🔔 Seeding Notifications...');
        const existingNotifications = await Notification.countDocuments();
        if (existingNotifications === 0) {
            await Notification.insertMany([
                {
                    user: technician._id,
                    type: 'request_assigned',
                    title: 'New Maintenance Request Assigned',
                    message: 'You have been assigned to: CNC Machine - Spindle Overheating Issue',
                    relatedRequest: requests[0]?._id,
                    isRead: false
                },
                {
                    user: manager._id,
                    type: 'request_overdue',
                    title: 'Overdue Maintenance Request',
                    message: 'Request "Network Switch - Port Failure" is overdue',
                    relatedRequest: requests[1]?._id,
                    isRead: false
                },
                {
                    user: technician._id,
                    type: 'status_change',
                    title: 'Request Status Updated',
                    message: 'Hydraulic Press - Oil Leak has been marked as In Progress',
                    relatedRequest: requests[2]?._id,
                    isRead: true
                },
                {
                    user: manager._id,
                    type: 'low_stock',
                    title: 'Low Stock Alert',
                    message: 'HVAC Compressor Belt stock is below minimum level',
                    isRead: false
                }
            ]);
            console.log('✅ Created 4 notifications');
        } else {
            console.log(`⚠️  Notifications already exist (${existingNotifications} items)`);
        }

        // ==================== AUDIT LOGS ====================
        console.log('\n📝 Seeding Audit Logs...');
        const existingLogs = await AuditLog.countDocuments();
        if (existingLogs === 0) {
            await AuditLog.insertMany([
                {
                    user: manager._id,
                    action: 'CREATE',
                    resource: 'MaintenanceRequest',
                    resourceId: requests[0]?._id,
                    details: 'Created new maintenance request for CNC Machine',
                    ipAddress: '192.168.1.100'
                },
                {
                    user: technician._id,
                    action: 'UPDATE',
                    resource: 'MaintenanceRequest',
                    resourceId: requests[0]?._id,
                    changes: {
                        status: { old: 'New', new: 'In Progress' }
                    },
                    details: 'Updated request status to In Progress',
                    ipAddress: '192.168.1.105'
                },
                {
                    user: manager._id,
                    action: 'CREATE',
                    resource: 'Equipment',
                    resourceId: equipment[0]?._id,
                    details: 'Added new equipment: CNC Milling Machine',
                    ipAddress: '192.168.1.100'
                },
                {
                    user: manager._id,
                    action: 'UPDATE',
                    resource: 'Budget',
                    details: 'Updated Q1 2026 Manufacturing budget allocation',
                    ipAddress: '192.168.1.100'
                },
                {
                    user: technician._id,
                    action: 'DELETE',
                    resource: 'Attachment',
                    details: 'Removed outdated maintenance report',
                    ipAddress: '192.168.1.105'
                }
            ]);
            console.log('✅ Created 5 audit log entries');
        } else {
            console.log(`⚠️  Audit logs already exist (${existingLogs} entries)`);
        }

        // ==================== ATTACHMENTS ====================
        console.log('\n📎 Seeding Attachments...');
        const existingAttachments = await Attachment.countDocuments();
        if (existingAttachments === 0) {
            await Attachment.insertMany([
                {
                    fileName: 'cnc_spindle_diagnosis.pdf',
                    originalName: 'CNC Spindle Diagnostic Report.pdf',
                    mimeType: 'application/pdf',
                    fileSize: 245678,
                    filePath: '/uploads/attachments/cnc_spindle_diagnosis.pdf',
                    relatedModel: 'MaintenanceRequest',
                    relatedId: requests[0]?._id,
                    uploadedBy: technician._id,
                    description: 'Diagnostic report for overheating spindle'
                },
                {
                    fileName: 'hydraulic_leak_photo.jpg',
                    originalName: 'Hydraulic Leak Photo.jpg',
                    mimeType: 'image/jpeg',
                    fileSize: 1234567,
                    filePath: '/uploads/attachments/hydraulic_leak_photo.jpg',
                    relatedModel: 'MaintenanceRequest',
                    relatedId: requests[2]?._id,
                    uploadedBy: technician._id,
                    description: 'Photo of hydraulic oil leak location'
                },
                {
                    fileName: 'equipment_manual_vfd.pdf',
                    originalName: 'VFD Installation Manual.pdf',
                    mimeType: 'application/pdf',
                    fileSize: 3456789,
                    filePath: '/uploads/attachments/equipment_manual_vfd.pdf',
                    relatedModel: 'Equipment',
                    relatedId: equipment[4]?._id,
                    uploadedBy: manager._id,
                    description: 'Installation and maintenance manual for VFD'
                }
            ]);
            console.log('✅ Created 3 attachment records');
        } else {
            console.log(`⚠️  Attachments already exist (${existingAttachments} items)`);
        }

        // ==================== SUMMARY ====================
        console.log('\n' + '='.repeat(60));
        console.log('🎉 ALL COLLECTIONS SEEDED SUCCESSFULLY!');
        console.log('='.repeat(60));

        // Get final counts
        const counts = {
            users: await User.countDocuments(),
            equipment: await Equipment.countDocuments(),
            teams: await MaintenanceTeam.countDocuments(),
            requests: await MaintenanceRequest.countDocuments(),
            spareParts: await SparePart.countDocuments(),
            budgets: await Budget.countDocuments(),
            slas: await SLA.countDocuments(),
            notifications: await Notification.countDocuments(),
            auditLogs: await AuditLog.countDocuments(),
            attachments: await Attachment.countDocuments()
        };

        console.log('\n📊 Database Summary:');
        console.log(`   👥 Users: ${counts.users}`);
        console.log(`   ⚙️  Equipment: ${counts.equipment}`);
        console.log(`   🔧 Teams: ${counts.teams}`);
        console.log(`   📋 Maintenance Requests: ${counts.requests}`);
        console.log(`   🔩 Spare Parts: ${counts.spareParts}`);
        console.log(`   💰 Budgets: ${counts.budgets}`);
        console.log(`   📋 SLAs: ${counts.slas}`);
        console.log(`   🔔 Notifications: ${counts.notifications}`);
        console.log(`   📝 Audit Logs: ${counts.auditLogs}`);
        console.log(`   📎 Attachments: ${counts.attachments}`);

        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        console.log(`\n   TOTAL DOCUMENTS: ${total}`);

        console.log('\n✅ All collections are now populated with sample data!');
        console.log('🚀 Your application is ready to use!\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedAllCollections();
