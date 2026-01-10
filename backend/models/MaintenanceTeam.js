const mongoose = require('mongoose');

const maintenanceTeamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide team name'],
            unique: true,
            trim: true,
        },
        type: {
            type: String,
            required: [true, 'Please provide team type'],
            enum: ['Mechanics', 'Electricians', 'IT Support', 'HVAC', 'Plumbing', 'General', 'Other'],
        },
        description: {
            type: String,
            trim: true,
        },
        teamLead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        specialization: {
            type: [String],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Virtual for member count
maintenanceTeamSchema.virtual('memberCount').get(function () {
    return this.members.length;
});

module.exports = mongoose.model('MaintenanceTeam', maintenanceTeamSchema);
