const Equipment = require('../models/Equipment');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { checkBookingOverlap, getEquipmentBookedRanges } = require('../utils/availabilityHelper');

// @desc    Get all equipment with search, filter, sort & pagination
// @route   GET /api/equipment
// @access  Public
const getEquipments = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      condition,
      isAvailable,
      sort,
      featured,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Keyword search
    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { brand: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Brand filter
    if (brand && brand !== 'All') {
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    // Condition filter
    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    // Availability filter
    if (isAvailable !== undefined && isAvailable !== '') {
      query.isAvailable = isAvailable === 'true' || isAvailable === true;
    }

    // Featured filter
    if (featured !== undefined) {
      query.featured = featured === 'true' || featured === true;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.dailyPrice = {};
      if (minPrice) query.dailyPrice.$gte = Number(minPrice);
      if (maxPrice) query.dailyPrice.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOptions = { dailyPrice: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { dailyPrice: -1 };
    } else if (sort === 'rating') {
      sortOptions = { averageRating: -1, numReviews: -1 };
    } else if (sort === 'popular') {
      sortOptions = { totalRentals: -1, averageRating: -1 };
    } else if (sort === 'name_asc') {
      sortOptions = { name: 1 };
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Equipment.countDocuments(query);
    const equipments = await Equipment.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      data: equipments,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get equipment by ID
// @route   GET /api/equipment/:id
// @access  Public
const getEquipmentById = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment item not found.',
      });
    }

    // Fetch reviews
    const reviews = await Review.find({ equipmentId: equipment._id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    // Fetch upcoming booked date ranges for calendar
    const bookedRanges = await getEquipmentBookedRanges(equipment._id);

    res.json({
      success: true,
      data: {
        ...equipment.toObject(),
        reviews,
        bookedRanges,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check dates availability for equipment
// @route   GET /api/equipment/:id/availability
// @access  Public
const checkEquipmentAvailability = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Both startDate and endDate query parameters are required.',
      });
    }

    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    if (!equipment.isAvailable) {
      return res.json({
        success: true,
        available: false,
        reason: 'This equipment is currently marked as unavailable for rent by administrator.',
      });
    }

    const { hasConflict, conflictingBooking } = await checkBookingOverlap(
      equipment._id,
      startDate,
      endDate
    );

    const bookedRanges = await getEquipmentBookedRanges(equipment._id);

    res.json({
      success: true,
      available: !hasConflict,
      conflict: hasConflict ? conflictingBooking : null,
      bookedRanges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new equipment
// @route   POST /api/equipment
// @access  Private/Admin
const createEquipment = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      modelNumber,
      images,
      specifications,
      dailyPrice,
      securityDeposit,
      condition,
      isAvailable,
      featured,
      location,
    } = req.body;

    if (!name || !description || !category || !brand || !dailyPrice) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, category, brand, and daily price are required fields.',
      });
    }

    const imageArray = Array.isArray(images) && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'];

    const equipment = await Equipment.create({
      name,
      description,
      category,
      brand,
      modelNumber: modelNumber || '',
      images: imageArray,
      specifications: Array.isArray(specifications) ? specifications : [],
      dailyPrice: Number(dailyPrice),
      securityDeposit: Number(securityDeposit || 0),
      condition: condition || 'Like New',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      featured: Boolean(featured),
      location: location || 'Main Hub',
    });

    res.status(201).json({
      success: true,
      message: 'Equipment created successfully.',
      data: equipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private/Admin
const updateEquipment = async (req, res, next) => {
  try {
    let equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found.',
      });
    }

    equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Equipment updated successfully.',
      data: equipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private/Admin
const deleteEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found.',
      });
    }

    // Check if there are active bookings
    const activeBooking = await Booking.findOne({
      equipmentId: equipment._id,
      bookingStatus: { $in: ['approved', 'active'] },
    });

    if (activeBooking) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete equipment with approved or active rental bookings. Please cancel or complete them first.',
      });
    }

    await equipment.deleteOne();

    res.json({
      success: true,
      message: 'Equipment deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all distinct categories with counts
// @route   GET /api/equipment/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categoriesWithCount = await Equipment.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          minPrice: { $min: '$dailyPrice' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: categoriesWithCount.map((c) => ({
        name: c._id,
        count: c.count,
        minPrice: c.minPrice,
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEquipments,
  getEquipmentById,
  checkEquipmentAvailability,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getCategories,
};

