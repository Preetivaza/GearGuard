const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: [
                'request_created',
                'request_assigned',
                'request_updated',
                'request_completed',
                'equipment_added',
                'team_assigned',
                'sla_warning',
                'sla_breached',
                'low_stock',
                'budget_alert',
                'general',
            ],
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
        },
        relatedEntityType: {
            type: String,
            enum: ['Equipment', 'MaintenanceRequest', 'MaintenanceTeam', 'SparePart', 'Budget'],
        },
        relatedEntityId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'relatedEntityType',
        },
        actionUrl: {
            type: String,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });

// Auto-set readAt when isRead is set to true
notificationSchema.pre('save', function (next) {
    if (this.isModified('isRead') && this.isRead && !this.readAt) {
        this.readAt = new Date();
    }
    next();
});

module.exports = mongoose.model('Notification', notificationSchema);
