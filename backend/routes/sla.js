const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getSLAs,
    getSLA,
    createSLA,
    updateSLA,
    deleteSLA,
    getMatchingSLA,
} = require('../controllers/slaController');

router.route('/match').get(protect, getMatchingSLA);

router
    .route('/')
    .get(protect, getSLAs)
    .post(protect, authorize('Manager'), createSLA);

router
    .route('/:id')
    .get(protect, getSLA)
    .put(protect, authorize('Manager'), updateSLA)
    .delete(protect, authorize('Manager'), deleteSLA);

module.exports = router;
