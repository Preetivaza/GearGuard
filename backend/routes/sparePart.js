const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getSpareParts,
    getSparePart,
    createSparePart,
    updateSparePart,
    adjustStock,
    deleteSparePart,
    getLowStockParts,
} = require('../controllers/sparePartController');

router.route('/alerts/low-stock').get(protect, getLowStockParts);

router
    .route('/')
    .get(protect, getSpareParts)
    .post(protect, authorize('Manager'), createSparePart);

router
    .route('/:id')
    .get(protect, getSparePart)
    .put(protect, authorize('Manager'), updateSparePart)
    .delete(protect, authorize('Manager'), deleteSparePart);

router.route('/:id/adjust-stock').patch(protect, authorize('Technician', 'Manager'), adjustStock);

module.exports = router;
