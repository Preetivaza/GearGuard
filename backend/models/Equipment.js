const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide equipment name'],
            trim: true,
        },
        serialNumber: {
            type: String,
            required: [true, 'Please provide serial number'],
            unique: true,
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Please provide category'],
            enum: ['Machinery', 'Electronics', 'Vehicles', 'Tools', 'IT Equipment', 'Other'],
        },
        department: {
            type: String,
            required: [true, 'Please provide department'],
            trim: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        maintenanceTeam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MaintenanceTeam',
            required: [true, 'Please assign a maintenance team'],
        },
        location: {
            type: String,
            required: [true, 'Please provide location'],
            trim: true,
        },
        warrantyExpiry: {
            type: Date,
        },
        purchaseDate: {
            type: Date,
            required: [true, 'Please provide purchase date'],
        },
        cost: {
            type: Number,
            min: 0,
        },
        status: {
            type: String,
            enum: ['Active', 'Under Maintenance', 'Scrapped'],
            default: 'Active',
        },
        description: {
            type: String,
            trim: true,
        },
        specifications: {
            type: Map,
            of: String,
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
equipmentSchema.index({ department: 1, status: 1 });
equipmentSchema.index({ serialNumber: 1 });

module.exports = mongoose.model('Equipment', equipmentSchema);
