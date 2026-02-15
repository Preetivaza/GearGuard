const SparePart = require('../models/SparePart');
const { createNotification } = require('./notificationController');

// @desc    Get all spare parts
// @route   GET /api/spare-parts
// @access  Private
exports.getSpareParts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        let filter = {};

        // Filter by category
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Filter by status
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Search by name or SKU
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { sku: { $regex: req.query.search, $options: 'i' } },
            ];
        }

        const spareParts = await SparePart.find(filter)
            .populate('compatibleEquipment', 'name serialNumber')
            .populate('createdBy', 'name email')
            .sort({ name: 1 })
            .limit(limit)
            .skip(skip);

        const total = await SparePart.countDocuments(filter);

        res.json({
            success: true,
            count: spareParts.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: spareParts,
        });
    } catch (error) {
        console.error('Error fetching spare parts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching spare parts',
            error: error.message,
        });
    }
};

// @desc    Get single spare part
// @route   GET /api/spare-parts/:id
// @access  Private
exports.getSparePart = async (req, res) => {
    try {
        const sparePart = await SparePart.findById(req.params.id)
            .populate('compatibleEquipment', 'name serialNumber category')
            .populate('createdBy', 'name email department');

        if (!sparePart) {
            return res.status(404).json({
                success: false,
                message: 'Spare part not found',
            });
        }

        res.json({
            success: true,
            data: sparePart,
        });
    } catch (error) {
        console.error('Error fetching spare part:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching spare part',
            error: error.message,
        });
    }
};

// @desc    Create spare part
// @route   POST /api/spare-parts
// @access  Private (Manager only)
exports.createSparePart = async (req, res) => {
    try {
        req.body.createdBy = req.user._id;

        // Handle supplier field - convert string to object if needed
        if (req.body.supplier && typeof req.body.supplier === 'string') {
            req.body.supplier = {
                name: req.body.supplier,
                contact: '',
                email: ''
            };
        }

        const sparePart = await SparePart.create(req.body);

        res.status(201).json({
            success: true,
            data: sparePart,
        });
    } catch (error) {
        console.error('Error creating spare part:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating spare part',
            error: error.message,
        });
    }
};

// @desc    Update spare part
// @route   PUT /api/spare-parts/:id
// @access  Private (Manager only)
exports.updateSparePart = async (req, res) => {
    try {
        let sparePart = await SparePart.findById(req.params.id);

        if (!sparePart) {
            return res.status(404).json({
                success: false,
                message: 'Spare part not found',
            });
        }

        // Handle supplier field - convert string to object if needed
        if (req.body.supplier && typeof req.body.supplier === 'string') {
            req.body.supplier = {
                name: req.body.supplier,
                contact: '',
                email: ''
            };
        }

        sparePart = await SparePart.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({
            success: true,
            data: sparePart,
        });
    } catch (error) {
        console.error('Error updating spare part:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating spare part',
            error: error.message,
        });
    }
};

// @desc    Adjust stock quantity
// @route   PATCH /api/spare-parts/:id/adjust-stock
// @access  Private (Technician, Manager)
exports.adjustStock = async (req, res) => {
    try {
        const { adjustment, reason } = req.body;

        if (!adjustment || typeof adjustment !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid adjustment value',
            });
        }

        const sparePart = await SparePart.findById(req.params.id);

        if (!sparePart) {
            return res.status(404).json({
                success: false,
                message: 'Spare part not found',
            });
        }

        const newQuantity = sparePart.quantity + adjustment;

        if (newQuantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock',
            });
        }

        sparePart.quantity = newQuantity;

        if (adjustment > 0) {
            sparePart.lastRestocked = new Date();
        }

        await sparePart.save();

        // Check for low stock and create notification
        if (sparePart.status === 'Low Stock' || sparePart.status === 'Out of Stock') {
            // Notify all managers
            const User = require('../models/User');
            const managers = await User.find({ role: 'Manager', isActive: true });
            
            for (const manager of managers) {
                await createNotification({
                    recipient: manager._id,
                    title: `Low Stock Alert: ${sparePart.name}`,
                    message: `Stock level is ${sparePart.status.toLowerCase()} (${sparePart.quantity} ${sparePart.unit} remaining)`,
                    type: 'low_stock',
                    priority: sparePart.quantity === 0 ? 'high' : 'medium',
                    relatedEntityType: 'SparePart',
                    relatedEntityId: sparePart._id,
                    createdBy: req.user._id,
                });
            }
        }

        res.json({
            success: true,
            data: sparePart,
            message: `Stock adjusted successfully. ${reason || ''}`,
        });
    } catch (error) {
        console.error('Error adjusting stock:', error);
        res.status(500).json({
            success: false,
            message: 'Error adjusting stock',
            error: error.message,
        });
    }
};

// @desc    Delete spare part
// @route   DELETE /api/spare-parts/:id
// @access  Private (Manager only)
exports.deleteSparePart = async (req, res) => {
    try {
        const sparePart = await SparePart.findById(req.params.id);

        if (!sparePart) {
            return res.status(404).json({
                success: false,
                message: 'Spare part not found',
            });
        }

        await sparePart.deleteOne();

        res.json({
            success: true,
            message: 'Spare part deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting spare part:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting spare part',
            error: error.message,
        });
    }
};

// @desc    Get low stock parts
// @route   GET /api/spare-parts/alerts/low-stock
// @access  Private
exports.getLowStockParts = async (req, res) => {
    try {
        const lowStockParts = await SparePart.find({
            status: { $in: ['Low Stock', 'Out of Stock'] },
        })
            .populate('createdBy', 'name email')
            .sort({ quantity: 1 });

        res.json({
            success: true,
            count: lowStockParts.length,
            data: lowStockParts,
        });
    } catch (error) {
        console.error('Error fetching low stock parts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching low stock parts',
            error: error.message,
        });
    }
};
