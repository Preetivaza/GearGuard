const mongoose = require('mongoose');

const testActivitySchema = new mongoose.Schema({
    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: [true, 'Equipment is required']
    },
    testType: {
        type: String,
        enum: ['Functional', 'Performance', 'Safety', 'Quality', 'Operational', 'Pre-Delivery'],
        required: [true, 'Test type is required']
    },
    testName: {
        type: String,
        required: [true, 'Test name is required'],
        trim: true
    },
    testDescription: {
        type: String,
        trim: true
    },
    testedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Tester is required']
    },
    testDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Passed', 'Failed', 'Skipped'],
        default: 'Pending'
    },
    result: {
        type: String,
        enum: ['Pass', 'Fail', 'Partial', 'N/A'],
        default: 'N/A'
    },
    score: {
        type: Number,
        min: 0,
        max: 100
    },
    parameters: [{
        name: String,
        expectedValue: String,
        actualValue: String,
        result: {
            type: String,
            enum: ['Pass', 'Fail']
        }
    }],
    observations: {
        type: String,
        trim: true
    },
    recommendations: {
        type: String,
        trim: true
    },
    attachments: [{
        fileName: String,
        fileUrl: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    nextTestDue: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes for better query performance
testActivitySchema.index({ equipment: 1, testDate: -1 });
testActivitySchema.index({ status: 1 });
testActivitySchema.index({ result: 1 });

module.exports = mongoose.model('TestActivity', testActivitySchema);
