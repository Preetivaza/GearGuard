const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide budget name'],
            trim: true,
        },
        department: {
            type: String,
            required: [true, 'Please provide department'],
            trim: true,
        },
        fiscalYear: {
            type: Number,
            required: [true, 'Please provide fiscal year'],
        },
        period: {
            type: String,
            required: true,
            enum: ['Monthly', 'Quarterly', 'Yearly'],
        },
        startDate: {
            type: Date,
            required: [true, 'Please provide start date'],
        },
        endDate: {
            type: Date,
            required: [true, 'Please provide end date'],
        },
        allocatedAmount: {
            type: Number,
            required: [true, 'Please provide allocated amount'],
            min: 0,
        },
        spentAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        remainingAmount: {
            type: Number,
            default: 0,
        },
        categories: [
            {
                name: {
                    type: String,
                    required: true,
                },
                allocated: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                spent: {
                    type: Number,
                    default: 0,
                    min: 0,
                },
            },
        ],
        status: {
            type: String,
            enum: ['Active', 'Exceeded', 'Closed'],
            default: 'Active',
        },
        alertThreshold: {
            type: Number,
            default: 80,
            min: 0,
            max: 100,
        },
        notes: {
            type: String,
            trim: true,
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
budgetSchema.index({ department: 1, fiscalYear: 1 });
budgetSchema.index({ startDate: 1, endDate: 1 });
budgetSchema.index({ status: 1 });

// Calculate remaining amount and update status before saving
budgetSchema.pre('save', function (next) {
    this.remainingAmount = this.allocatedAmount - this.spentAmount;
    
    const utilizationPercentage = (this.spentAmount / this.allocatedAmount) * 100;
    
    if (utilizationPercentage >= 100) {
        this.status = 'Exceeded';
    } else if (new Date() > this.endDate) {
        this.status = 'Closed';
    } else {
        this.status = 'Active';
    }
    
    next();
});

// Virtual for utilization percentage
budgetSchema.virtual('utilizationPercentage').get(function () {
    if (this.allocatedAmount === 0) return 0;
    return Math.round((this.spentAmount / this.allocatedAmount) * 100);
});

// Virtual for alert status
budgetSchema.virtual('isOverThreshold').get(function () {
    const percentage = (this.spentAmount / this.allocatedAmount) * 100;
    return percentage >= this.alertThreshold;
});

module.exports = mongoose.model('Budget', budgetSchema);
