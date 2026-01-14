const Budget = require('../models/Budget');
const { createNotification } = require('./notificationController');

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res) => {
    try {
        const filter = {};

        if (req.query.department) {
            filter.department = req.query.department;
        }

        if (req.query.fiscalYear) {
            filter.fiscalYear = parseInt(req.query.fiscalYear);
        }

        if (req.query.status) {
            filter.status = req.query.status;
        }

        // For non-managers, filter by their department
        if (req.user.role !== 'Manager' && req.user.department) {
            filter.department = req.user.department;
        }

        const budgets = await Budget.find(filter)
            .populate('createdBy', 'name email department')
            .sort({ startDate: -1 });

        res.json({
            success: true,
            count: budgets.length,
            data: budgets,
        });
    } catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching budgets',
            error: error.message,
        });
    }
};

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
exports.getBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id).populate('createdBy', 'name email department');

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found',
            });
        }

        // Check access for non-managers
        if (req.user.role !== 'Manager' && budget.department !== req.user.department) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this budget',
            });
        }

        res.json({
            success: true,
            data: budget,
        });
    } catch (error) {
        console.error('Error fetching budget:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching budget',
            error: error.message,
        });
    }
};

// @desc    Create budget
// @route   POST /api/budgets
// @access  Private (Manager only)
exports.createBudget = async (req, res) => {
    try {
        req.body.createdBy = req.user._id;

        const budget = await Budget.create(req.body);

        res.status(201).json({
            success: true,
            data: budget,
        });
    } catch (error) {
        console.error('Error creating budget:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating budget',
            error: error.message,
        });
    }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private (Manager only)
exports.updateBudget = async (req, res) => {
    try {
        let budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found',
            });
        }

        budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({
            success: true,
            data: budget,
        });
    } catch (error) {
        console.error('Error updating budget:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating budget',
            error: error.message,
        });
    }
};

// @desc    Add expense to budget
// @route   PATCH /api/budgets/:id/add-expense
// @access  Private (Technician, Manager)
exports.addExpense = async (req, res) => {
    try {
        const { amount, category } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid expense amount',
            });
        }

        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found',
            });
        }

        const previousUtilization = budget.utilizationPercentage;
        budget.spentAmount += amount;

        // Update category spending if provided
        if (category && budget.categories) {
            const categoryIndex = budget.categories.findIndex((cat) => cat.name === category);
            if (categoryIndex !== -1) {
                budget.categories[categoryIndex].spent += amount;
            }
        }

        await budget.save();

        // Check if threshold crossed and send notification
        const currentUtilization = budget.utilizationPercentage;

        if (previousUtilization < budget.alertThreshold && currentUtilization >= budget.alertThreshold) {
            // Notify managers in the department
            const User = require('../models/User');
            const managers = await User.find({
                role: 'Manager',
                department: budget.department,
                isActive: true,
            });

            for (const manager of managers) {
                await createNotification({
                    recipient: manager._id,
                    title: `Budget Alert: ${budget.name}`,
                    message: `Budget utilization has reached ${currentUtilization}% (${budget.spentAmount} of ${budget.allocatedAmount})`,
                    type: 'budget_alert',
                    priority: currentUtilization >= 100 ? 'high' : 'medium',
                    relatedEntityType: 'Budget',
                    relatedEntityId: budget._id,
                    createdBy: req.user._id,
                });
            }
        }

        res.json({
            success: true,
            data: budget,
            message: 'Expense added to budget',
        });
    } catch (error) {
        console.error('Error adding expense to budget:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding expense to budget',
            error: error.message,
        });
    }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private (Manager only)
exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found',
            });
        }

        await budget.deleteOne();

        res.json({
            success: true,
            message: 'Budget deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting budget:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting budget',
            error: error.message,
        });
    }
};

// @desc    Get budget summary by department
// @route   GET /api/budgets/summary/by-department
// @access  Private (Manager only)
exports.getBudgetSummary = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const fiscalYear = req.query.fiscalYear || currentYear;

        const summary = await Budget.aggregate([
            {
                $match: {
                    fiscalYear: parseInt(fiscalYear),
                },
            },
            {
                $group: {
                    _id: '$department',
                    totalAllocated: { $sum: '$allocatedAmount' },
                    totalSpent: { $sum: '$spentAmount' },
                    totalRemaining: { $sum: '$remainingAmount' },
                    budgetCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    department: '$_id',
                    totalAllocated: 1,
                    totalSpent: 1,
                    totalRemaining: 1,
                    budgetCount: 1,
                    utilizationPercentage: {
                        $cond: [
                            { $eq: ['$totalAllocated', 0] },
                            0,
                            { $multiply: [{ $divide: ['$totalSpent', '$totalAllocated'] }, 100] },
                        ],
                    },
                },
            },
            {
                $sort: { utilizationPercentage: -1 },
            },
        ]);

        res.json({
            success: true,
            fiscalYear: parseInt(fiscalYear),
            data: summary,
        });
    } catch (error) {
        console.error('Error fetching budget summary:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching budget summary',
            error: error.message,
        });
    }
};
