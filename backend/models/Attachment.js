const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: [true, 'Please provide filename'],
            trim: true,
        },
        originalName: {
            type: String,
            required: true,
            trim: true,
        },
        fileType: {
            type: String,
            required: true,
            enum: ['image', 'pdf', 'document', 'other'],
        },
        mimeType: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            required: true,
        },
        filePath: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
        },
        entityType: {
            type: String,
            required: true,
            enum: ['Equipment', 'MaintenanceRequest', 'SparePart'],
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'entityType',
        },
        description: {
            type: String,
            trim: true,
        },
        uploadedBy: {
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
attachmentSchema.index({ entityType: 1, entityId: 1 });
attachmentSchema.index({ uploadedBy: 1 });

// Helper method to determine file type from mime type
attachmentSchema.pre('save', function (next) {
    if (this.mimeType.startsWith('image/')) {
        this.fileType = 'image';
    } else if (this.mimeType === 'application/pdf') {
        this.fileType = 'pdf';
    } else if (
        this.mimeType.includes('document') ||
        this.mimeType.includes('word') ||
        this.mimeType.includes('excel') ||
        this.mimeType.includes('spreadsheet')
    ) {
        this.fileType = 'document';
    } else {
        this.fileType = 'other';
    }
    next();
});

module.exports = mongoose.model('Attachment', attachmentSchema);
