const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAdminUsers,
  toggleBlockUser,
  getAdminReports,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.put('/users/:id/toggle-block', toggleBlockUser);
router.get('/reports', getAdminReports);

module.exports = router;

