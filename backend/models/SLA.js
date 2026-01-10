const mongoose = require('mongoose');

const slaSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide SLA name'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        priority: {
            type: String,
            required: true,
            enum: ['Low', 'Medium', 'High', 'Critical'],
        },
        requestType: {
            type: String,
            enum: ['Corrective', 'Preventive', 'Both'],
            default: 'Both',
        },
        responseTime: {
            value: {
                type: Number,
                required: [true, 'Please provide response time'],
                min: 1,
            },
            unit: {
                type: String,
                enum: ['minutes', 'hours', 'days'],
                default: 'hours',
            },
        },
        resolutionTime: {
            value: {
                type: Number,
                required: [true, 'Please provide resolution time'],
                min: 1,
            },
            unit: {
                type: String,
                enum: ['minutes', 'hours', 'days'],
                default: 'hours',
            },
        },
        escalationRules: [
            {
                level: {
                    type: Number,
                    required: true,
                },
                timeThreshold: {
                    type: Number,
                    required: true,
                },
                notifyRoles: [
                    {
                        type: String,
                        enum: ['User', 'Technician', 'Manager'],
                    },
                ],
            },
        ],
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

// Index for faster queries
slaSchema.index({ priority: 1, requestType: 1 });
slaSchema.index({ isActive: 1 });

// Helper method to convert time to minutes
slaSchema.methods.getResponseTimeInMinutes = function () {
    const multiplier = this.responseTime.unit === 'minutes' ? 1 : this.responseTime.unit === 'hours' ? 60 : 1440;
    return this.responseTime.value * multiplier;
};

slaSchema.methods.getResolutionTimeInMinutes = function () {
    const multiplier = this.resolutionTime.unit === 'minutes' ? 1 : this.resolutionTime.unit === 'hours' ? 60 : 1440;
    return this.resolutionTime.value * multiplier;
};

module.exports = mongoose.model('SLA', slaSchema);
