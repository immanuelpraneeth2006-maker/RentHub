const express = require('express');
const router = express.Router();
const {
  getEquipments,
  getEquipmentById,
  checkEquipmentAvailability,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getCategories,
} = require('../controllers/equipmentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/categories', getCategories);
router.get('/', getEquipments);
router.get('/:id/availability', checkEquipmentAvailability);
router.get('/:id', getEquipmentById);

// Admin-only endpoints
router.post('/', protect, admin, createEquipment);
router.put('/:id', protect, admin, updateEquipment);
router.delete('/:id', protect, admin, deleteEquipment);

module.exports = router;

