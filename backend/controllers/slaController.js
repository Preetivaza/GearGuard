const SLA = require('../models/SLA');

// @desc    Get all SLAs
// @route   GET /api/slas
// @access  Private
exports.getSLAs = async (req, res) => {
    try {
        const filter = {};

        if (req.query.priority) {
            filter.priority = req.query.priority;
        }

        if (req.query.isActive !== undefined) {
            filter.isActive = req.query.isActive === 'true';
        }

        const slas = await SLA.find(filter)
            .populate('createdBy', 'name email')
            .sort({ priority: 1 });

        res.json({
            success: true,
            count: slas.length,
            data: slas,
        });
    } catch (error) {
        console.error('Error fetching SLAs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching SLAs',
            error: error.message,
        });
    }
};

// @desc    Get single SLA
// @route   GET /api/slas/:id
// @access  Private
exports.getSLA = async (req, res) => {
    try {
        const sla = await SLA.findById(req.params.id).populate('createdBy', 'name email');

        if (!sla) {
            return res.status(404).json({
                success: false,
                message: 'SLA not found',
            });
        }

        res.json({
            success: true,
            data: sla,
        });
    } catch (error) {
        console.error('Error fetching SLA:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching SLA',
            error: error.message,
        });
    }
};

// @desc    Create SLA
// @route   POST /api/slas
// @access  Private (Manager only)
exports.createSLA = async (req, res) => {
    try {
        req.body.createdBy = req.user._id;

        const sla = await SLA.create(req.body);

        res.status(201).json({
            success: true,
            data: sla,
        });
    } catch (error) {
        console.error('Error creating SLA:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating SLA',
            error: error.message,
        });
    }
};

// @desc    Update SLA
// @route   PUT /api/slas/:id
// @access  Private (Manager only)
exports.updateSLA = async (req, res) => {
    try {
        let sla = await SLA.findById(req.params.id);

        if (!sla) {
            return res.status(404).json({
                success: false,
                message: 'SLA not found',
            });
        }

        sla = await SLA.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({
            success: true,
            data: sla,
        });
    } catch (error) {
        console.error('Error updating SLA:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating SLA',
            error: error.message,
        });
    }
};

// @desc    Delete SLA
// @route   DELETE /api/slas/:id
// @access  Private (Manager only)
exports.deleteSLA = async (req, res) => {
    try {
        const sla = await SLA.findById(req.params.id);

        if (!sla) {
            return res.status(404).json({
                success: false,
                message: 'SLA not found',
            });
        }

        await sla.deleteOne();

        res.json({
            success: true,
            message: 'SLA deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting SLA:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting SLA',
            error: error.message,
        });
    }
};

// @desc    Get matching SLA for request
// @route   GET /api/slas/match
// @access  Private
exports.getMatchingSLA = async (req, res) => {
    try {
        const { priority, requestType } = req.query;

        if (!priority) {
            return res.status(400).json({
                success: false,
                message: 'Priority is required',
            });
        }

        const sla = await SLA.findOne({
            priority,
            isActive: true,
            $or: [{ requestType: requestType || 'Both' }, { requestType: 'Both' }],
        });

        if (!sla) {
            return res.json({
                success: true,
                data: null,
                message: 'No matching SLA found',
            });
        }

        res.json({
            success: true,
            data: sla,
        });
    } catch (error) {
        console.error('Error finding matching SLA:', error);
        res.status(500).json({
            success: false,
            message: 'Error finding matching SLA',
            error: error.message,
        });
    }
};
