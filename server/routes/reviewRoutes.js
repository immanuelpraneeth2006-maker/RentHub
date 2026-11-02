const express = require('express');
const router = express.Router();
const { createReview, getReviewsByEquipment } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/:equipmentId', getReviewsByEquipment);

module.exports = router;

