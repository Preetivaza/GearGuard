const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
            enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'STATUS_CHANGE', 'ASSIGN', 'UPLOAD', 'DOWNLOAD'],
        },
        entityType: {
            type: String,
            required: true,
            enum: ['Equipment', 'MaintenanceRequest', 'MaintenanceTeam', 'User', 'SparePart', 'Budget', 'Attachment'],
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'entityType',
        },
        entityName: {
            type: String,
            trim: true,
        },
        changes: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        },
        previousData: {
            type: mongoose.Schema.Types.Mixed,
        },
        newData: {
            type: mongoose.Schema.Types.Mixed,
        },
        ipAddress: {
            type: String,
            trim: true,
        },
        userAgent: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

// Virtual for formatted log message
auditLogSchema.virtual('logMessage').get(function () {
    return `${this.action} ${this.entityType}${this.entityName ? `: ${this.entityName}` : ''}`;
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
