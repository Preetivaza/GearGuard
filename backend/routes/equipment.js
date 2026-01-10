const express = require('express');
const router = express.Router();
const {
    getEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    scrapEquipment,
    getEquipmentRequests,
} = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getEquipment)
    .post(protect, createEquipment);

router.route('/:id')
    .get(protect, getEquipmentById)
    .put(protect, updateEquipment)
    .delete(protect, authorize('Manager'), deleteEquipment);

router.put('/:id/scrap', protect, scrapEquipment);
router.get('/:id/requests', protect, getEquipmentRequests);

module.exports = router;
