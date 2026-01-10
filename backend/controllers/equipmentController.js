const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Private
const getEquipment = async (req, res) => {
    try {
        const { status, department, category } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (department) filter.department = department;
        if (category) filter.category = category;

        const equipment = await Equipment.find(filter)
            .populate('assignedTo', 'name email')
            .populate('maintenanceTeam', 'name type')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single equipment
// @route   GET /api/equipment/:id
// @access  Private
const getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id)
            .populate('assignedTo', 'name email department')
            .populate('maintenanceTeam', 'name type members')
            .populate('createdBy', 'name email');

        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create equipment
// @route   POST /api/equipment
// @access  Private
const createEquipment = async (req, res) => {
    try {
        const equipmentData = {
            ...req.body,
            createdBy: req.user._id,
        };

        const equipment = await Equipment.create(equipmentData);

        const populatedEquipment = await Equipment.findById(equipment._id)
            .populate('assignedTo', 'name email')
            .populate('maintenanceTeam', 'name type')
            .populate('createdBy', 'name email');

        res.status(201).json(populatedEquipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private
const updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        const updatedEquipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('assignedTo', 'name email')
            .populate('maintenanceTeam', 'name type')
            .populate('createdBy', 'name email');

        res.json(updatedEquipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private/Manager
const deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        await equipment.deleteOne();

        res.json({ message: 'Equipment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark equipment as scrap
// @route   PUT /api/equipment/:id/scrap
// @access  Private
const scrapEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        equipment.status = 'Scrapped';
        await equipment.save();

        res.json({ message: 'Equipment marked as scrapped', equipment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get maintenance requests for equipment
// @route   GET /api/equipment/:id/requests
// @access  Private
const getEquipmentRequests = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.find({ equipment: req.params.id })
            .populate('maintenanceTeam', 'name type')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    scrapEquipment,
    getEquipmentRequests,
};
