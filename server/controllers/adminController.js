const User = require('../models/User');
const Equipment = require('../models/Equipment');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc    Get Admin Dashboard KPI Statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalEquipment,
      availableEquipment,
      activeRentals,
      pendingBookings,
      approvedBookings,
      completedBookings,
      cancelledBookings,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Equipment.countDocuments(),
      Equipment.countDocuments({ isAvailable: true }),
      Booking.countDocuments({ bookingStatus: 'active' }),
      Booking.countDocuments({ bookingStatus: 'pending' }),
      Booking.countDocuments({ bookingStatus: 'approved' }),
      Booking.countDocuments({ bookingStatus: 'completed' }),
      Booking.countDocuments({ bookingStatus: 'cancelled' }),
    ]);

    // Calculate revenue from completed or paid bookings
    const revenueAggregation = await Booking.aggregate([
      {
        $match: {
          bookingStatus: { $in: ['active', 'completed', 'approved'] },
        },
      },
      {
        $group: {
          _id: null,
          totalRentalRevenue: { $sum: '$rentalAmount' },
          totalDepositsHeld: { $sum: '$securityDeposit' },
          totalGrossAmount: { $sum: '$totalAmount' },
        },
      },
    ]);

    const stats = {
      totalUsers,
      totalEquipment,
      availableEquipment,
      activeRentals,
      pendingBookings,
      approvedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue: revenueAggregation[0]?.totalRentalRevenue || 0,
      depositsHeld: revenueAggregation[0]?.totalDepositsHeld || 0,
      grossTurnover: revenueAggregation[0]?.totalGrossAmount || 0,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list with booking summaries
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Enhance users with their booking count
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const bookingsCount = await Booking.countDocuments({ userId: u._id });
        const activeCount = await Booking.countDocuments({
          userId: u._id,
          bookingStatus: 'active',
        });
        return {
          ...u.toObject(),
          totalBookings: bookingsCount,
          activeBookings: activeCount,
        };
      })
    );

    res.json({
      success: true,
      count: usersWithStats.length,
      data: usersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle block/unblock user
// @route   PUT /api/admin/users/:id/toggle-block
// @access  Private/Admin
const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot block administrator accounts.',
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBlocked ? 'suspended' : 'activated'} successfully.`,
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin reports (Monthly revenue, Most rented gear, Category breakdown)
// @route   GET /api/admin/reports
// @access  Private/Admin
const getAdminReports = async (req, res, next) => {
  try {
    // 1. Most rented equipment
    const topEquipment = await Equipment.find()
      .sort({ totalRentals: -1, averageRating: -1 })
      .limit(6)
      .select('name brand category dailyPrice totalRentals averageRating images');

    // 2. Equipment category distribution
    const categoryDistribution = await Equipment.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$dailyPrice' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 3. Monthly bookings in last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalBookings: { $sum: 1 },
          revenue: { $sum: '$rentalAmount' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // 4. Recent activity log (latest 10 bookings)
    const recentActivity = await Booking.find()
      .populate('userId', 'name email avatar')
      .populate('equipmentId', 'name brand')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        topEquipment,
        categoryDistribution,
        monthlyBookings,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAdminUsers,
  toggleBlockUser,
  getAdminReports,
};

