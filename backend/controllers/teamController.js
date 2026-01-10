const MaintenanceTeam = require('../models/MaintenanceTeam');

// @desc    Get all maintenance teams
// @route   GET /api/teams
// @access  Private
const getTeams = async (req, res) => {
    try {
        const { type, isActive } = req.query;
        const filter = {};

        if (type) filter.type = type;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const teams = await MaintenanceTeam.find(filter)
            .populate('teamLead', 'name email role')
            .populate('members', 'name email role')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
const getTeamById = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findById(req.params.id)
            .populate('teamLead', 'name email role department phone')
            .populate('members', 'name email role department phone')
            .populate('createdBy', 'name email');

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create maintenance team
// @route   POST /api/teams
// @access  Private/Manager
const createTeam = async (req, res) => {
    try {
        const teamData = {
            ...req.body,
            createdBy: req.user._id,
        };

        const team = await MaintenanceTeam.create(teamData);

        const populatedTeam = await MaintenanceTeam.findById(team._id)
            .populate('teamLead', 'name email role')
            .populate('members', 'name email role')
            .populate('createdBy', 'name email');

        res.status(201).json(populatedTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update maintenance team
// @route   PUT /api/teams/:id
// @access  Private/Manager
const updateTeam = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const updatedTeam = await MaintenanceTeam.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('teamLead', 'name email role')
            .populate('members', 'name email role')
            .populate('createdBy', 'name email');

        res.json(updatedTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete maintenance team
// @route   DELETE /api/teams/:id
// @access  Private/Manager
const deleteTeam = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        await team.deleteOne();

        res.json({ message: 'Team removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add member to team
// @route   PUT /api/teams/:id/members
// @access  Private/Manager
const addTeamMember = async (req, res) => {
    try {
        const { userId } = req.body;
        const team = await MaintenanceTeam.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (team.members.includes(userId)) {
            return res.status(400).json({ message: 'User is already a member' });
        }

        team.members.push(userId);
        await team.save();

        const updatedTeam = await MaintenanceTeam.findById(team._id)
            .populate('teamLead', 'name email role')
            .populate('members', 'name email role');

        res.json(updatedTeam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private/Manager
const removeTeamMember = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        team.members = team.members.filter(
            (member) => member.toString() !== req.params.userId
        );
        await team.save();

        const updatedTeam = await MaintenanceTeam.findById(team._id)
            .populate('teamLead', 'name email role')
            .populate('members', 'name email role');

        res.json(updatedTeam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
};
