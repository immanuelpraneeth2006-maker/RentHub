const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/upload
// @desc    Upload single image
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image file.' });
  }

  // Construct URL
  const filePath = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Image uploaded successfully',
    url: filePath,
  });
});

// @route   POST /api/upload/multiple
// @desc    Upload up to 5 images
// @access  Private
router.post('/multiple', protect, upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Please upload at least one image.' });
  }

  const urls = req.files.map((file) => `/uploads/${file.filename}`);
  res.json({
    success: true,
    message: `${urls.length} images uploaded successfully`,
    urls,
  });
});

module.exports = router;

