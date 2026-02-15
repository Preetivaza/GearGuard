const TestActivity = require('../models/TestActivity');
const Equipment = require('../models/Equipment');

// @desc    Get all test activities
// @route   GET /api/test-activities
// @access  Private
exports.getTestActivities = async (req, res) => {
    try {
        const { equipment, status, result, testType } = req.query;
        
        const filter = {};
        if (equipment) filter.equipment = equipment;
        if (status) filter.status = status;
        if (result) filter.result = result;
        if (testType) filter.testType = testType;

        const testActivities = await TestActivity.find(filter)
            .populate('equipment', 'name serialNumber')
            .populate('testedBy', 'name email')
            .populate('createdBy', 'name')
            .sort({ testDate: -1 });

        res.json({
            success: true,
            count: testActivities.length,
            data: testActivities
        });
    } catch (error) {
        console.error('Error fetching test activities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching test activities',
            error: error.message
        });
    }
};

// @desc    Get single test activity
// @route   GET /api/test-activities/:id
// @access  Private
exports.getTestActivity = async (req, res) => {
    try {
        const testActivity = await TestActivity.findById(req.params.id)
            .populate('equipment', 'name serialNumber category')
            .populate('testedBy', 'name email role')
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name');

        if (!testActivity) {
            return res.status(404).json({
                success: false,
                message: 'Test activity not found'
            });
        }

        res.json({
            success: true,
            data: testActivity
        });
    } catch (error) {
        console.error('Error fetching test activity:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching test activity',
            error: error.message
        });
    }
};

// @desc    Create new test activity
// @route   POST /api/test-activities
// @access  Private
exports.createTestActivity = async (req, res) => {
    try {
        // Verify equipment exists
        const equipment = await Equipment.findById(req.body.equipment);
        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        const testActivity = await TestActivity.create({
            ...req.body,
            createdBy: req.user._id,
            testedBy: req.body.testedBy || req.user._id
        });

        const populatedActivity = await TestActivity.findById(testActivity._id)
            .populate('equipment', 'name serialNumber')
            .populate('testedBy', 'name email')
            .populate('createdBy', 'name');

        res.status(201).json({
            success: true,
            message: 'Test activity created successfully',
            data: populatedActivity
        });
    } catch (error) {
        console.error('Error creating test activity:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating test activity',
            error: error.message
        });
    }
};

// @desc    Update test activity
// @route   PUT /api/test-activities/:id
// @access  Private
exports.updateTestActivity = async (req, res) => {
    try {
        let testActivity = await TestActivity.findById(req.params.id);

        if (!testActivity) {
            return res.status(404).json({
                success: false,
                message: 'Test activity not found'
            });
        }

        testActivity = await TestActivity.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                updatedBy: req.user._id
            },
            {
                new: true,
                runValidators: true
            }
        )
            .populate('equipment', 'name serialNumber')
            .populate('testedBy', 'name email')
            .populate('updatedBy', 'name');

        res.json({
            success: true,
            message: 'Test activity updated successfully',
            data: testActivity
        });
    } catch (error) {
        console.error('Error updating test activity:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating test activity',
            error: error.message
        });
    }
};

// @desc    Delete test activity
// @route   DELETE /api/test-activities/:id
// @access  Private
exports.deleteTestActivity = async (req, res) => {
    try {
        const testActivity = await TestActivity.findById(req.params.id);

        if (!testActivity) {
            return res.status(404).json({
                success: false,
                message: 'Test activity not found'
            });
        }

        await testActivity.deleteOne();

        res.json({
            success: true,
            message: 'Test activity deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting test activity:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting test activity',
            error: error.message
        });
    }
};

// @desc    Get test activities for specific equipment
// @route   GET /api/test-activities/equipment/:equipmentId
// @access  Private
exports.getEquipmentTestHistory = async (req, res) => {
    try {
        const testActivities = await TestActivity.find({
            equipment: req.params.equipmentId
        })
            .populate('testedBy', 'name email')
            .sort({ testDate: -1 });

        res.json({
            success: true,
            count: testActivities.length,
            data: testActivities
        });
    } catch (error) {
        console.error('Error fetching equipment test history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching equipment test history',
            error: error.message
        });
    }
};

// @desc    Get test activity statistics
// @route   GET /api/test-activities/stats
// @access  Private
exports.getTestActivityStats = async (req, res) => {
    try {
        const stats = await TestActivity.aggregate([
            {
                $group: {
                    _id: '$result',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusStats = await TestActivity.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const typeStats = await TestActivity.aggregate([
            {
                $group: {
                    _id: '$testType',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                byResult: stats,
                byStatus: statusStats,
                byType: typeStats
            }
        });
    } catch (error) {
        console.error('Error fetching test activity stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching test activity statistics',
            error: error.message
        });
    }
};
