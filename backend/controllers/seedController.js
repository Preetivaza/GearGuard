const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const User = require('../models/User');

// @desc    Seed dummy data for testing
// @route   POST /api/seed/dummy-data
// @access  Private (Manager only)
exports.seedDummyData = async (req, res) => {
    try {
        // First, check if scrap requests already exist
        const existingScrapRequests = await MaintenanceRequest.find({ status: 'Scrap' });

        if (existingScrapRequests.length > 0) {
            return res.json({
                success: true,
                message: `Found ${existingScrapRequests.length} existing scrap requests in database`,
                data: existingScrapRequests
            });
        }

        // No scrap requests found, create dummy ones
        // Get a user to assign as creator
        const user = await User.findOne();

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'No users found. Please create a user first.'
            });
        }

        // Get some equipment
        const equipment = await Equipment.findOne();

        if (!equipment) {
            return res.status(400).json({
                success: false,
                message: 'No equipment found. Please create equipment first.'
            });
        }

        // Create dummy scrap requests
        const scrapRequests = await MaintenanceRequest.insertMany([
            {
                title: 'Motor Burnt Out - Beyond Repair',
                description: 'Motor overheated and burnt out completely. Cannot be repaired.',
                equipment: equipment._id,
                requestType: 'Corrective',
                status: 'Scrap',
                priority: 'Critical',
                createdBy: user._id
            },
            {
                title: 'Hydraulic System Failure',
                description: 'Complete hydraulic system failure. Replacement required.',
                equipment: equipment._id,
                requestType: 'Corrective',
                status: 'Scrap',
                priority: 'High',
                createdBy: user._id
            },
            {
                title: 'Structural Damage - Unrepairable',
                description: 'Major structural damage from accident. Equipment to be scrapped.',
                equipment: equipment._id,
                requestType: 'Corrective',
                status: 'Scrap',
                priority: 'High',
                createdBy: user._id
            }
        ]);

        res.json({
            success: true,
            message: `Successfully created ${scrapRequests.length} new scrap requests`,
            data: scrapRequests
        });
    } catch (error) {
        console.error('Error seeding dummy data:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating dummy data',
            error: error.message
        });
    }
};
