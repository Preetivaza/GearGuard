const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide request title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide description'],
        },
        equipment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment',
            required: [true, 'Please select equipment'],
        },
        requestType: {
            type: String,
            required: [true, 'Please specify request type'],
            enum: ['Corrective', 'Preventive'],
        },
        status: {
            type: String,
            enum: ['New', 'In Progress', 'Repaired', 'Scrap'],
            default: 'New',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium',
        },
        maintenanceTeam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MaintenanceTeam',
            required: [true, 'Please assign a maintenance team'],
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        scheduledDate: {
            type: Date,
        },
        completedDate: {
            type: Date,
        },
        estimatedCost: {
            type: Number,
            min: 0,
        },
        actualCost: {
            type: Number,
            min: 0,
        },
        notes: {
            type: String,
        },
        // Spare parts tracking
        partsUsed: [
            {
                part: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'SparePart',
                },
                quantity: {
                    type: Number,
                    min: 1,
                    required: true,
                },
                cost: {
                    type: Number,
                    min: 0,
                },
            },
        ],
        // SLA tracking
        sla: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SLA',
        },
        slaDeadline: {
            type: Date,
        },
        slaStatus: {
            type: String,
            enum: ['On Time', 'At Risk', 'Breached', 'N/A'],
            default: 'N/A',
        },
        responseTime: {
            type: Date,
        },
        resolutionTime: {
            type: Date,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
maintenanceRequestSchema.index({ status: 1, priority: 1 });
maintenanceRequestSchema.index({ equipment: 1 });
maintenanceRequestSchema.index({ scheduledDate: 1 });
maintenanceRequestSchema.index({ slaStatus: 1 });
maintenanceRequestSchema.index({ slaDeadline: 1 });

// Virtual for time remaining until SLA deadline
maintenanceRequestSchema.virtual('slaTimeRemaining').get(function () {
    if (!this.slaDeadline || this.status === 'Repaired' || this.status === 'Scrap') {
        return null;
    }
    const now = new Date();
    const diffMs = this.slaDeadline - now;
    return diffMs > 0 ? Math.floor(diffMs / (1000 * 60)) : 0; // Returns minutes
});

// Update equipment status when request status changes
maintenanceRequestSchema.post('save', async function () {
    const Equipment = mongoose.model('Equipment');

    if (this.status === 'In Progress') {
        await Equipment.findByIdAndUpdate(this.equipment, {
            status: 'Under Maintenance',
        });
    } else if (this.status === 'Repaired') {
        await Equipment.findByIdAndUpdate(this.equipment, {
            status: 'Active',
        });
    } else if (this.status === 'Scrap') {
        await Equipment.findByIdAndUpdate(this.equipment, {
            status: 'Scrapped',
        });
    }
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
