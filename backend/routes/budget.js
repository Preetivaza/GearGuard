const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getBudgets,
    getBudget,
    createBudget,
    updateBudget,
    addExpense,
    deleteBudget,
    getBudgetSummary,
} = require('../controllers/budgetController');

router.route('/summary/by-department').get(protect, authorize('Manager'), getBudgetSummary);

router
    .route('/')
    .get(protect, getBudgets)
    .post(protect, authorize('Manager'), createBudget);

router
    .route('/:id')
    .get(protect, getBudget)
    .put(protect, authorize('Manager'), updateBudget)
    .delete(protect, authorize('Manager'), deleteBudget);

router.route('/:id/add-expense').patch(protect, authorize('Technician', 'Manager'), addExpense);

module.exports = router;
