require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const MaintenanceTeam = require('./models/MaintenanceTeam');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');

const seedDatabase = async () => {
    try {
        // Connect to database
        await connectDB();

        console.log('🗑️  Clearing existing data...');

        // Drop collections if they exist to remove all indexes
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        if (collectionNames.includes('users')) await mongoose.connection.db.dropCollection('users');
        if (collectionNames.includes('maintenanceteams')) await mongoose.connection.db.dropCollection('maintenanceteams');
        if (collectionNames.includes('equipment')) await mongoose.connection.db.dropCollection('equipment');
        if (collectionNames.includes('maintenancerequests')) await mongoose.connection.db.dropCollection('maintenancerequests');

        console.log('✅ Database cleared successfully');

        // ==================== USERS ====================
        console.log('👥 Creating users...');

        const users = await User.create([
            // Managers
            {
                name: 'Sarah Johnson',
                email: 'sarah.johnson@gearguard.com',
                password: 'password123',
                role: 'Manager',
                department: 'Operations',
                phone: '+1-555-0101'
            },
            {
                name: 'Michael Chen',
                email: 'michael.chen@gearguard.com',
                password: 'password123',
                role: 'Manager',
                department: 'IT',
                phone: '+1-555-0102'
            },
            {
                name: 'Emily Rodriguez',
                email: 'emily.rodriguez@gearguard.com',
                password: 'password123',
                role: 'Manager',
                department: 'Manufacturing',
                phone: '+1-555-0103'
            },

            // Technicians
            {
                name: 'David Martinez',
                email: 'david.martinez@gearguard.com',
                password: 'password123',
                role: 'Technician',
                department: 'Maintenance',
                phone: '+1-555-0201'
            },
            {
                name: 'Lisa Anderson',
                email: 'lisa.anderson@gearguard.com',
                password: 'password123',
                role: 'Technician',
                department: 'IT Support',
                phone: '+1-555-0202'
            },
            {
                name: 'James Wilson',
                email: 'james.wilson@gearguard.com',
                password: 'password123',
                role: 'Technician',
                department: 'Electrical',
                phone: '+1-555-0203'
            },
            {
                name: 'Maria Garcia',
                email: 'maria.garcia@gearguard.com',
                password: 'password123',
                role: 'Technician',
                department: 'HVAC',
                phone: '+1-555-0204'
            },
            {
                name: 'Robert Taylor',
                email: 'robert.taylor@gearguard.com',
                password: 'password123',
                role: 'Technician',
                department: 'Mechanical',
                phone: '+1-555-0205'
            },

            // Regular Users
            {
                name: 'Jennifer Brown',
                email: 'jennifer.brown@gearguard.com',
                password: 'password123',
                role: 'User',
                department: 'Production',
                phone: '+1-555-0301'
            },
            {
                name: 'Thomas Lee',
                email: 'thomas.lee@gearguard.com',
                password: 'password123',
                role: 'User',
                department: 'Quality Control',
                phone: '+1-555-0302'
            },
            {
                name: 'Patricia White',
                email: 'patricia.white@gearguard.com',
                password: 'password123',
                role: 'User',
                department: 'Logistics',
                phone: '+1-555-0303'
            },
            {
                name: 'Christopher Davis',
                email: 'christopher.davis@gearguard.com',
                password: 'password123',
                role: 'User',
                department: 'Warehouse',
                phone: '+1-555-0304'
            }
        ]);

        console.log(`✅ Created ${users.length} users`);

        // ==================== MAINTENANCE TEAMS ====================
        console.log('🔧 Creating maintenance teams...');

        const teams = await MaintenanceTeam.create([
            {
                name: 'Mechanical Engineering Team',
                type: 'Mechanics',
                description: 'Specialized in heavy machinery, production equipment, and mechanical systems',
                teamLead: users[3]._id, // David Martinez
                members: [users[3]._id, users[7]._id], // David, Robert
                specialization: ['CNC Machines', 'Hydraulic Systems', 'Conveyor Belts', 'Industrial Pumps'],
                createdBy: users[0]._id // Sarah Johnson
            },
            {
                name: 'Electrical Systems Team',
                type: 'Electricians',
                description: 'Handles all electrical installations, repairs, and preventive maintenance',
                teamLead: users[5]._id, // James Wilson
                members: [users[5]._id],
                specialization: ['Control Panels', 'Power Distribution', 'Motor Controls', 'Lighting Systems'],
                createdBy: users[0]._id
            },
            {
                name: 'IT Infrastructure Team',
                type: 'IT Support',
                description: 'Maintains computer systems, servers, networks, and IT equipment',
                teamLead: users[4]._id, // Lisa Anderson
                members: [users[4]._id],
                specialization: ['Servers', 'Workstations', 'Network Equipment', 'Printers', 'Security Systems'],
                createdBy: users[1]._id // Michael Chen
            },
            {
                name: 'HVAC & Climate Control',
                type: 'HVAC',
                description: 'Manages heating, ventilation, air conditioning, and environmental control systems',
                teamLead: users[6]._id, // Maria Garcia
                members: [users[6]._id],
                specialization: ['Air Conditioning', 'Ventilation Systems', 'Refrigeration', 'Air Quality'],
                createdBy: users[0]._id
            },
            {
                name: 'General Maintenance',
                type: 'General',
                description: 'Handles routine maintenance, facility upkeep, and general repairs',
                teamLead: users[3]._id,
                members: [users[3]._id, users[7]._id],
                specialization: ['Building Maintenance', 'Plumbing', 'Carpentry', 'Painting'],
                createdBy: users[0]._id
            }
        ]);

        console.log(`✅ Created ${teams.length} maintenance teams`);

        // ==================== EQUIPMENT ====================
        console.log('⚙️  Creating equipment...');

        const equipment = await Equipment.create([
            // Machinery
            {
                name: 'CNC Milling Machine - Haas VF-4',
                serialNumber: 'CNC-2023-001',
                category: 'Machinery',
                department: 'Manufacturing',
                assignedTo: users[8]._id, // Jennifer Brown
                maintenanceTeam: teams[0]._id, // Mechanical Team
                location: 'Production Floor A - Station 12',
                warrantyExpiry: new Date('2025-06-30'),
                purchaseDate: new Date('2022-07-15'),
                cost: 125000,
                status: 'Active',
                description: 'High-precision CNC milling machine for metal fabrication and part production',
                specifications: {
                    'Model': 'Haas VF-4',
                    'Work Area': '50" x 20" x 25"',
                    'Spindle Speed': '8100 RPM',
                    'Tool Capacity': '24 tools'
                },
                createdBy: users[2]._id // Emily Rodriguez
            },
            {
                name: 'Hydraulic Press - 200 Ton',
                serialNumber: 'HYD-2022-015',
                category: 'Machinery',
                department: 'Manufacturing',
                maintenanceTeam: teams[0]._id,
                location: 'Press Shop - Bay 3',
                warrantyExpiry: new Date('2024-12-31'),
                purchaseDate: new Date('2021-11-20'),
                cost: 85000,
                status: 'Active',
                description: 'Heavy-duty hydraulic press for metal forming and stamping operations',
                specifications: {
                    'Capacity': '200 tons',
                    'Bed Size': '48" x 36"',
                    'Stroke': '24 inches',
                    'Power': '40 HP'
                },
                createdBy: users[2]._id
            },
            {
                name: 'Industrial Conveyor System',
                serialNumber: 'CONV-2023-008',
                category: 'Machinery',
                department: 'Logistics',
                maintenanceTeam: teams[0]._id,
                location: 'Warehouse - Main Line',
                warrantyExpiry: new Date('2026-03-15'),
                purchaseDate: new Date('2023-03-15'),
                cost: 45000,
                status: 'Active',
                description: 'Automated conveyor system for material handling and product transport',
                specifications: {
                    'Length': '150 feet',
                    'Width': '24 inches',
                    'Speed': 'Variable 0-100 ft/min',
                    'Load Capacity': '500 lbs'
                },
                createdBy: users[0]._id
            },

            // Electronics
            {
                name: 'Programmable Logic Controller (PLC)',
                serialNumber: 'PLC-2023-042',
                category: 'Electronics',
                department: 'Automation',
                maintenanceTeam: teams[1]._id, // Electrical Team
                location: 'Control Room - Panel A3',
                warrantyExpiry: new Date('2025-09-30'),
                purchaseDate: new Date('2022-09-10'),
                cost: 15000,
                status: 'Active',
                description: 'Allen-Bradley PLC controlling automated production line sequences',
                specifications: {
                    'Brand': 'Allen-Bradley',
                    'Model': 'ControlLogix 5580',
                    'I/O Points': '256',
                    'Memory': '10 MB'
                },
                createdBy: users[2]._id
            },
            {
                name: 'Variable Frequency Drive (VFD)',
                serialNumber: 'VFD-2022-128',
                category: 'Electronics',
                department: 'Manufacturing',
                maintenanceTeam: teams[1]._id,
                location: 'Motor Control Center - MCC-2',
                warrantyExpiry: new Date('2025-01-15'),
                purchaseDate: new Date('2022-01-15'),
                cost: 8500,
                status: 'Active',
                description: 'Variable frequency drive for controlling motor speed in production equipment',
                specifications: {
                    'Power Rating': '75 HP',
                    'Voltage': '480V 3-Phase',
                    'Brand': 'ABB',
                    'Communication': 'Modbus RTU'
                },
                createdBy: users[2]._id
            },

            // IT Equipment
            {
                name: 'Dell PowerEdge R750 Server',
                serialNumber: 'SRV-2023-001',
                category: 'IT Equipment',
                department: 'IT',
                maintenanceTeam: teams[2]._id, // IT Team
                location: 'Data Center - Rack B12',
                warrantyExpiry: new Date('2026-08-20'),
                purchaseDate: new Date('2023-08-20'),
                cost: 12000,
                status: 'Active',
                description: 'Production database server running critical business applications',
                specifications: {
                    'Processor': 'Intel Xeon Gold 6338',
                    'RAM': '128 GB DDR4',
                    'Storage': '4TB SSD RAID 10',
                    'OS': 'Windows Server 2022'
                },
                createdBy: users[1]._id
            },
            {
                name: 'Cisco Catalyst 9300 Network Switch',
                serialNumber: 'NET-2023-015',
                category: 'IT Equipment',
                department: 'IT',
                maintenanceTeam: teams[2]._id,
                location: 'Network Closet - Floor 2',
                warrantyExpiry: new Date('2026-05-10'),
                purchaseDate: new Date('2023-05-10'),
                cost: 8000,
                status: 'Active',
                description: 'Core network switch providing connectivity for production floor',
                specifications: {
                    'Ports': '48x 1Gb + 4x 10Gb SFP+',
                    'Switching Capacity': '440 Gbps',
                    'Managed': 'Yes',
                    'PoE': '740W PoE+'
                },
                createdBy: users[1]._id
            },
            {
                name: 'HP LaserJet Enterprise M608',
                serialNumber: 'PRT-2022-034',
                category: 'IT Equipment',
                department: 'Administration',
                maintenanceTeam: teams[2]._id,
                location: 'Office Wing - 2nd Floor',
                warrantyExpiry: new Date('2025-02-28'),
                purchaseDate: new Date('2022-02-28'),
                cost: 1200,
                status: 'Active',
                description: 'High-volume network printer for office documentation',
                specifications: {
                    'Print Speed': '65 ppm',
                    'Duplex': 'Automatic',
                    'Network': 'Ethernet + WiFi',
                    'Monthly Duty': '275,000 pages'
                },
                createdBy: users[1]._id
            },

            // Vehicles
            {
                name: 'Toyota Forklift 8FGU25',
                serialNumber: 'FRK-2021-003',
                category: 'Vehicles',
                department: 'Warehouse',
                assignedTo: users[11]._id, // Christopher Davis
                maintenanceTeam: teams[0]._id,
                location: 'Warehouse - Dock Area',
                warrantyExpiry: new Date('2024-04-15'),
                purchaseDate: new Date('2021-04-15'),
                cost: 32000,
                status: 'Active',
                description: 'Propane-powered forklift for material handling and loading operations',
                specifications: {
                    'Capacity': '5,000 lbs',
                    'Lift Height': '188 inches',
                    'Fuel Type': 'Propane',
                    'Tire Type': 'Pneumatic'
                },
                createdBy: users[0]._id
            },
            {
                name: 'Maintenance Service Van - Ford Transit',
                serialNumber: 'VAN-2022-002',
                category: 'Vehicles',
                department: 'Maintenance',
                assignedTo: users[3]._id, // David Martinez
                maintenanceTeam: teams[4]._id,
                location: 'Parking Lot - Maintenance Bay',
                warrantyExpiry: new Date('2025-06-01'),
                purchaseDate: new Date('2022-06-01'),
                cost: 45000,
                status: 'Active',
                description: 'Service van equipped with tools and parts for on-site maintenance',
                specifications: {
                    'Make': 'Ford Transit 250',
                    'Cargo Volume': '246.7 cu ft',
                    'Payload': '3,470 lbs',
                    'Engine': '3.5L V6'
                },
                createdBy: users[0]._id
            },

            // HVAC
            {
                name: 'Trane Chiller Unit - 150 Ton',
                serialNumber: 'HVAC-2020-001',
                category: 'Other',
                department: 'Facilities',
                maintenanceTeam: teams[3]._id, // HVAC Team
                location: 'Roof - East Wing',
                warrantyExpiry: new Date('2025-07-30'),
                purchaseDate: new Date('2020-07-30'),
                cost: 95000,
                status: 'Active',
                description: 'Central chiller providing cooling for manufacturing facility',
                specifications: {
                    'Capacity': '150 tons',
                    'Refrigerant': 'R-410A',
                    'Compressor Type': 'Scroll',
                    'Efficiency': '14.5 EER'
                },
                createdBy: users[0]._id
            },
            {
                name: 'Industrial Air Compressor',
                serialNumber: 'COMP-2021-007',
                category: 'Machinery',
                department: 'Manufacturing',
                maintenanceTeam: teams[0]._id,
                location: 'Compressor Room - Building A',
                warrantyExpiry: new Date('2024-10-15'),
                purchaseDate: new Date('2021-10-15'),
                cost: 28000,
                status: 'Active',
                description: 'Rotary screw air compressor supplying pneumatic tools and equipment',
                specifications: {
                    'Output': '100 CFM',
                    'Pressure': '125 PSI',
                    'Motor': '25 HP',
                    'Tank': '240 gallon'
                },
                createdBy: users[2]._id
            }
        ]);

        console.log(`✅ Created ${equipment.length} equipment items`);

        // ==================== MAINTENANCE REQUESTS ====================
        console.log('📋 Creating maintenance requests...');

        const requests = await MaintenanceRequest.create([
            // Active/Urgent requests
            {
                title: 'CNC Machine - Spindle Overheating Issue',
                description: 'The main spindle on CNC-2023-001 is running hot (95°C) during operation. Normal operating temperature should be below 70°C. This may indicate bearing wear or lubrication issues. Requiring immediate attention to prevent damage.',
                equipment: equipment[0]._id,
                requestType: 'Corrective',
                status: 'In Progress',
                priority: 'Critical',
                maintenanceTeam: teams[0]._id,
                assignedTo: users[3]._id, // David Martinez
                scheduledDate: new Date('2025-12-28'),
                estimatedCost: 2500,
                notes: 'Ordered replacement bearings and thermal paste. Scheduled for weekend maintenance.',
                createdBy: users[8]._id, // Jennifer Brown
                updatedBy: users[3]._id
            },
            {
                title: 'Network Switch - Port Failure',
                description: 'Multiple ports (ports 12-16) on the Cisco switch NET-2023-015 are no longer responding. Devices connected to these ports have lost network connectivity. Need urgent diagnosis and repair.',
                equipment: equipment[6]._id,
                requestType: 'Corrective',
                status: 'New',
                priority: 'High',
                maintenanceTeam: teams[2]._id,
                assignedTo: users[4]._id, // Lisa Anderson
                scheduledDate: new Date('2025-12-27'),
                estimatedCost: 1500,
                notes: 'Temporary workaround in place using backup switch. Permanent fix needed soon.',
                createdBy: users[1]._id
            },
            {
                title: 'Hydraulic Press - Oil Leak',
                description: 'Discovered hydraulic oil leak from the main cylinder on HYD-2022-015. Approximately 2 quarts of oil lost. Press has been shut down to prevent further leakage and environmental hazard.',
                equipment: equipment[1]._id,
                requestType: 'Corrective',
                status: 'In Progress',
                priority: 'High',
                maintenanceTeam: teams[0]._id,
                assignedTo: users[7]._id, // Robert Taylor
                scheduledDate: new Date('2025-12-27'),
                estimatedCost: 3000,
                actualCost: 2850,
                notes: 'Seal replacement in progress. Expected completion by end of day.',
                createdBy: users[2]._id,
                updatedBy: users[7]._id
            },
            {
                title: 'Server - High CPU Usage Alert',
                description: 'Production database server SRV-2023-001 showing sustained 95%+ CPU usage for past 6 hours. Application performance degraded. Need to investigate cause - possibly runaway queries or resource leak.',
                equipment: equipment[5]._id,
                requestType: 'Corrective',
                status: 'In Progress',
                priority: 'Critical',
                maintenanceTeam: teams[2]._id,
                assignedTo: users[4]._id,
                scheduledDate: new Date('2025-12-27'),
                estimatedCost: 500,
                notes: 'Initial analysis shows database index fragmentation. Rebuilding indexes.',
                createdBy: users[1]._id,
                updatedBy: users[4]._id
            },

            // Preventive maintenance
            {
                title: 'Quarterly Preventive Maintenance - Conveyor System',
                description: 'Scheduled quarterly inspection and maintenance of industrial conveyor system. Tasks include: belt tension check, roller bearing lubrication, chain alignment, motor inspection, and safety sensor testing.',
                equipment: equipment[2]._id,
                requestType: 'Preventive',
                status: 'New',
                priority: 'Medium',
                maintenanceTeam: teams[0]._id,
                scheduledDate: new Date('2025-12-30'),
                estimatedCost: 800,
                notes: 'Scheduled during weekend shift to minimize production impact.',
                createdBy: users[0]._id
            },
            {
                title: 'Annual Chiller Maintenance',
                description: 'Annual preventive maintenance for Trane chiller unit. Includes: refrigerant level check, compressor inspection, condenser coil cleaning, control calibration, leak detection, and performance testing.',
                equipment: equipment[10]._id,
                requestType: 'Preventive',
                status: 'New',
                priority: 'Medium',
                maintenanceTeam: teams[3]._id,
                assignedTo: users[6]._id, // Maria Garcia
                scheduledDate: new Date('2026-01-15'),
                estimatedCost: 4500,
                notes: 'Contractor certification required for refrigerant work. Have scheduled certified technician.',
                createdBy: users[0]._id
            },
            {
                title: 'PLC Battery Replacement',
                description: 'Preventive replacement of backup battery in PLC-2023-042. Battery health monitoring shows 60% capacity remaining. Replacing before it reaches critical level to prevent program loss.',
                equipment: equipment[3]._id,
                requestType: 'Preventive',
                status: 'New',
                priority: 'Low',
                maintenanceTeam: teams[1]._id,
                assignedTo: users[5]._id, // James Wilson
                scheduledDate: new Date('2025-12-29'),
                estimatedCost: 200,
                notes: 'Battery ordered. Will replace during scheduled maintenance window.',
                createdBy: users[2]._id
            },
            {
                title: 'Forklift Annual Safety Inspection',
                description: 'Required annual safety inspection for Toyota forklift FRK-2021-003. Inspection covers: brakes, steering, hydraulics, forks, safety lights, horn, seatbelt, and load backrest. OSHA compliance check.',
                equipment: equipment[8]._id,
                requestType: 'Preventive',
                status: 'New',
                priority: 'Medium',
                maintenanceTeam: teams[4]._id,
                scheduledDate: new Date('2026-01-05'),
                estimatedCost: 350,
                notes: 'Certification must be completed before January 15, 2026.',
                createdBy: users[11]._id
            },

            // Completed requests
            {
                title: 'VFD Parameter Configuration',
                description: 'Configure VFD-2022-128 parameters for new motor installation. Set acceleration/deceleration ramps, overload protection, and communication settings.',
                equipment: equipment[4]._id,
                requestType: 'Corrective',
                status: 'Repaired',
                priority: 'Medium',
                maintenanceTeam: teams[1]._id,
                assignedTo: users[5]._id,
                scheduledDate: new Date('2025-12-20'),
                completedDate: new Date('2025-12-20'),
                estimatedCost: 400,
                actualCost: 350,
                notes: 'Configuration completed successfully. Motor running at optimal parameters.',
                createdBy: users[2]._id,
                updatedBy: users[5]._id
            },
            {
                title: 'Printer Toner Replacement & Cleaning',
                description: 'Replace toner cartridges and perform routine cleaning on HP printer PRT-2022-034. Print quality has degraded with streaking visible on documents.',
                equipment: equipment[7]._id,
                requestType: 'Preventive',
                status: 'Repaired',
                priority: 'Low',
                maintenanceTeam: teams[2]._id,
                assignedTo: users[4]._id,
                scheduledDate: new Date('2025-12-22'),
                completedDate: new Date('2025-12-22'),
                estimatedCost: 150,
                actualCost: 145,
                notes: 'Replaced toner, cleaned fuser assembly. Print quality restored to normal.',
                createdBy: users[1]._id,
                updatedBy: users[4]._id
            },
            {
                title: 'Service Van Oil Change & Inspection',
                description: 'Routine 5,000-mile service for maintenance van VAN-2022-002. Oil change, filter replacement, tire rotation, brake inspection, and fluid level checks.',
                equipment: equipment[9]._id,
                requestType: 'Preventive',
                status: 'Repaired',
                priority: 'Low',
                maintenanceTeam: teams[4]._id,
                scheduledDate: new Date('2025-12-18'),
                completedDate: new Date('2025-12-18'),
                estimatedCost: 200,
                actualCost: 185,
                notes: 'All service completed. Next service due at 45,000 miles.',
                createdBy: users[3]._id,
                updatedBy: users[3]._id
            },
            {
                title: 'Air Compressor - Weekly Maintenance',
                description: 'Weekly preventive maintenance for air compressor COMP-2021-007. Drain moisture from tank, check oil level, inspect air filters, verify pressure settings.',
                equipment: equipment[11]._id,
                requestType: 'Preventive',
                status: 'Repaired',
                priority: 'Low',
                maintenanceTeam: teams[0]._id,
                assignedTo: users[7]._id,
                scheduledDate: new Date('2025-12-23'),
                completedDate: new Date('2025-12-23'),
                estimatedCost: 100,
                actualCost: 75,
                notes: 'Routine maintenance completed. System operating normally.',
                createdBy: users[2]._id,
                updatedBy: users[7]._id
            }
        ]);

        console.log(`✅ Created ${requests.length} maintenance requests`);

        // ==================== SUMMARY ====================
        console.log('\n' + '='.repeat(60));
        console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(60));
        console.log(`\n📊 Summary:`);
        console.log(`   👥 Users created: ${users.length}`);
        console.log(`   🔧 Teams created: ${teams.length}`);
        console.log(`   ⚙️  Equipment created: ${equipment.length}`);
        console.log(`   📋 Requests created: ${requests.length}`);
        console.log('\n💡 Test Credentials:');
        console.log('   Manager: sarah.johnson@gearguard.com / password123');
        console.log('   Technician: david.martinez@gearguard.com / password123');
        console.log('   User: jennifer.brown@gearguard.com / password123');
        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
