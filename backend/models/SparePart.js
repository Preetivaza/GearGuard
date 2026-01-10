const mongoose = require('mongoose');

const sparePartSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide part name'],
            trim: true,
        },
        sku: {
            type: String,
            required: [true, 'Please provide SKU'],
            unique: true,
            trim: true,
            uppercase: true,
        },
        category: {
            type: String,
            required: [true, 'Please provide category'],
            enum: ['Mechanical', 'Electrical', 'Electronics', 'Consumable', 'Tool', 'Safety', 'Other'],
        },
        description: {
            type: String,
            trim: true,
        },
        quantity: {
            type: Number,
            required: [true, 'Please provide quantity'],
            min: 0,
            default: 0,
        },
        unit: {
            type: String,
            required: true,
            default: 'pcs',
            trim: true,
        },
        minimumStock: {
            type: Number,
            required: [true, 'Please provide minimum stock level'],
            min: 0,
            default: 5,
        },
        unitPrice: {
            type: Number,
            required: [true, 'Please provide unit price'],
            min: 0,
        },
        totalValue: {
            type: Number,
            default: 0,
        },
        supplier: {
            name: {
                type: String,
                trim: true,
            },
            contact: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                trim: true,
                lowercase: true,
            },
        },
        location: {
            type: String,
            trim: true,
        },
        compatibleEquipment: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Equipment',
            },
        ],
        status: {
            type: String,
            enum: ['In Stock', 'Low Stock', 'Out of Stock', 'Discontinued'],
            default: 'In Stock',
        },
        lastRestocked: {
            type: Date,
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
sparePartSchema.index({ sku: 1 });
sparePartSchema.index({ category: 1, status: 1 });
sparePartSchema.index({ name: 'text', description: 'text' });

// Calculate total value before saving
sparePartSchema.pre('save', function (next) {
    this.totalValue = this.quantity * this.unitPrice;
    
    // Auto-update status based on quantity
    if (this.quantity === 0) {
        this.status = 'Out of Stock';
    } else if (this.quantity <= this.minimumStock) {
        this.status = 'Low Stock';
    } else {
        this.status = 'In Stock';
    }
    
    next();
});

// Virtual for stock percentage
sparePartSchema.virtual('stockPercentage').get(function () {
    if (this.minimumStock === 0) return 100;
    return Math.round((this.quantity / (this.minimumStock * 2)) * 100);
});

module.exports = mongoose.model('SparePart', sparePartSchema);
