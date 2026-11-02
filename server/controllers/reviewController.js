const Review = require('../models/Review');
const Equipment = require('../models/Equipment');
const Booking = require('../models/Booking');

// @desc    Create review for equipment
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { equipmentId, rating, comment, bookingId } = req.body;

    if (!equipmentId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Equipment ID, rating (1-5), and comment are required.',
      });
    }

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found.',
      });
    }

    // Optional check: Did user book this equipment?
    const hasBooked = await Booking.findOne({
      userId: req.user._id,
      equipmentId,
      bookingStatus: { $in: ['completed', 'active', 'approved'] },
    });

    const review = await Review.create({
      userId: req.user._id,
      equipmentId,
      bookingId: bookingId || hasBooked?._id || null,
      rating: Number(rating),
      comment,
    });

    // Update equipment average rating and review count
    const allReviews = await Review.find({ equipmentId });
    const avgRating =
      allReviews.reduce((sum, item) => sum + item.rating, 0) / allReviews.length;

    equipment.averageRating = Number(avgRating.toFixed(1));
    equipment.numReviews = allReviews.length;
    await equipment.save();

    await review.populate('userId', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for specific equipment
// @route   GET /api/reviews/:equipmentId
// @access  Public
const getReviewsByEquipment = async (req, res, next) => {
  try {
    const reviews = await Review.find({ equipmentId: req.params.equipmentId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReviewsByEquipment,
};

