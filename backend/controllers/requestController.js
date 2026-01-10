const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');

// @desc    Get all maintenance requests
// @route   GET /api/requests
// @access  Private
const getRequests = async (req, res) => {
    try {
        const { status, requestType, priority, startDate, endDate } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (requestType) filter.requestType = requestType;
        if (priority) filter.priority = priority;

        if (startDate || endDate) {
            filter.scheduledDate = {};
            if (startDate) filter.scheduledDate.$gte = new Date(startDate);
            if (endDate) filter.scheduledDate.$lte = new Date(endDate);
        }

        const requests = await MaintenanceRequest.find(filter)
            .populate('equipment', 'name serialNumber category department')
            .populate('maintenanceTeam', 'name type')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
const getRequestById = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findById(req.params.id)
            .populate('equipment', 'name serialNumber category department location')
            .populate('maintenanceTeam', 'name type members')
            .populate('assignedTo', 'name email role phone')
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create maintenance request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res) => {
    try {
        // Auto-fill maintenance team from equipment if not provided
        if (!req.body.maintenanceTeam && req.body.equipment) {
            const equipment = await Equipment.findById(req.body.equipment);
            if (equipment && equipment.maintenanceTeam) {
                req.body.maintenanceTeam = equipment.maintenanceTeam;
            }
        }

        const requestData = {
            ...req.body,
            createdBy: req.user._id,
        };

        const request = await MaintenanceRequest.create(requestData);

        const populatedRequest = await MaintenanceRequest.findById(request._id)
            .populate('equipment', 'name serialNumber category')
            .populate('maintenanceTeam', 'name type')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        res.status(201).json(populatedRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update maintenance request
// @route   PUT /api/requests/:id
// @access  Private
const updateRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Track who updated the request
        req.body.updatedBy = req.user._id;

        // If status is being changed to Repaired, set completedDate
        if (req.body.status === 'Repaired' && request.status !== 'Repaired') {
            req.body.completedDate = new Date();
        }

        const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('equipment', 'name serialNumber category')
            .populate('maintenanceTeam', 'name type')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email');

        res.json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete maintenance request
// @route   DELETE /api/requests/:id
// @access  Private/Manager
const deleteRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        await request.deleteOne();

        res.json({ message: 'Request removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get requests for Kanban board
// @route   GET /api/requests/kanban
// @access  Private
const getKanbanData = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.find({})
            .populate('equipment', 'name serialNumber')
            .populate('maintenanceTeam', 'name')
            .populate('assignedTo', 'name')
            .sort({ priority: -1, createdAt: -1 });

        // Group by status
        const kanbanData = {
            New: requests.filter((r) => r.status === 'New'),
            'In Progress': requests.filter((r) => r.status === 'In Progress'),
            Repaired: requests.filter((r) => r.status === 'Repaired'),
            Scrap: requests.filter((r) => r.status === 'Scrap'),
        };

        res.json(kanbanData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get calendar data for preventive maintenance
// @route   GET /api/requests/calendar
// @access  Private
const getCalendarData = async (req, res) => {
    try {
        const { month, year } = req.query;
        const filter = { requestType: 'Preventive' };

        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            filter.scheduledDate = { $gte: startDate, $lte: endDate };
        }

        const requests = await MaintenanceRequest.find(filter)
            .populate('equipment', 'name serialNumber')
            .populate('maintenanceTeam', 'name')
            .sort({ scheduledDate: 1 });

        // Format for calendar
        const calendarEvents = requests.map((request) => ({
            id: request._id,
            title: request.title,
            start: request.scheduledDate,
            equipment: request.equipment?.name,
            team: request.maintenanceTeam?.name,
            status: request.status,
            priority: request.priority,
        }));

        res.json(calendarEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRequests,
    getRequestById,
    createRequest,
    updateRequest,
    deleteRequest,
    getKanbanData,
    getCalendarData,
};
