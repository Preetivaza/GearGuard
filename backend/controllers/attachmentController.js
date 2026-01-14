const Attachment = require('../models/Attachment');
const fs = require('fs').promises;
const path = require('path');

// @desc    Upload attachment
// @route   POST /api/attachments
// @access  Private
exports.uploadAttachment = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file',
            });
        }

        const { entityType, entityId, description } = req.body;

        if (!entityType || !entityId) {
            // Delete uploaded file if validation fails
            await fs.unlink(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Please provide entityType and entityId',
            });
        }

        const attachment = await Attachment.create({
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
            filePath: req.file.path,
            fileUrl: `/uploads/${req.file.filename}`,
            entityType,
            entityId,
            description,
            uploadedBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: attachment,
        });
    } catch (error) {
        // Delete uploaded file if database save fails
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        console.error('Error uploading attachment:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading attachment',
            error: error.message,
        });
    }
};

// @desc    Get attachments for an entity
// @route   GET /api/attachments/:entityType/:entityId
// @access  Private
exports.getAttachments = async (req, res) => {
    try {
        const { entityType, entityId } = req.params;

        const attachments = await Attachment.find({ entityType, entityId })
            .populate('uploadedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: attachments.length,
            data: attachments,
        });
    } catch (error) {
        console.error('Error fetching attachments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attachments',
            error: error.message,
        });
    }
};

// @desc    Download attachment
// @route   GET /api/attachments/:id/download
// @access  Private
exports.downloadAttachment = async (req, res) => {
    try {
        const attachment = await Attachment.findById(req.params.id);

        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: 'Attachment not found',
            });
        }

        res.download(attachment.filePath, attachment.originalName);
    } catch (error) {
        console.error('Error downloading attachment:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading attachment',
            error: error.message,
        });
    }
};

// @desc    Delete attachment
// @route   DELETE /api/attachments/:id
// @access  Private (Manager or uploader)
exports.deleteAttachment = async (req, res) => {
    try {
        const attachment = await Attachment.findById(req.params.id);

        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: 'Attachment not found',
            });
        }

        // Only uploader or manager can delete
        if (
            attachment.uploadedBy.toString() !== req.user._id.toString() &&
            req.user.role !== 'Manager'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this attachment',
            });
        }

        // Delete file from filesystem
        await fs.unlink(attachment.filePath).catch(() => {});

        // Delete from database
        await attachment.deleteOne();

        res.json({
            success: true,
            message: 'Attachment deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting attachment:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting attachment',
            error: error.message,
        });
    }
};
