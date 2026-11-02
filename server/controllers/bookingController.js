const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');
const { calculateDays, checkBookingOverlap } = require('../utils/availabilityHelper');

// @desc    Create a new rental booking request
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const {
      equipmentId,
      startDate,
      endDate,
      deliveryType,
      deliveryAddress,
      userNotes,
    } = req.body;

    if (!equipmentId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Equipment ID, start date, and end date are required.',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format provided.',
      });
    }

    // Check that start date is not in the past (allow today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkStart = new Date(start);
    checkStart.setHours(0, 0, 0, 0);

    if (checkStart < today) {
      return res.status(400).json({
        success: false,
        message: 'Rental start date cannot be in the past.',
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'Rental end date must be on or after the start date.',
      });
    }

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Selected equipment was not found.',
      });
    }

    if (!equipment.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This equipment is currently marked as unavailable for rent.',
      });
    }

    // CRITICAL: Double-booking prevention check on the backend
    const { hasConflict, conflictingBooking } = await checkBookingOverlap(
      equipment._id,
      start,
      end
    );

    if (hasConflict) {
      return res.status(409).json({
        success: false,
        message: 'Double Booking Prevented: This equipment is already booked for the selected dates.',
        conflictingBooking: {
          startDate: conflictingBooking.startDate,
          endDate: conflictingBooking.endDate,
          status: conflictingBooking.bookingStatus,
        },
      });
    }

    // Rental calculation
    const rentalDays = calculateDays(start, end);
    const rentalAmount = equipment.dailyPrice * rentalDays;
    const securityDeposit = equipment.securityDeposit || 0;
    const totalAmount = rentalAmount + securityDeposit;

    const booking = await Booking.create({
      userId: req.user._id,
      equipmentId: equipment._id,
      startDate: start,
      endDate: end,
      rentalDays,
      rentalAmount,
      securityDeposit,
      totalAmount,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
      deliveryType: deliveryType || 'store_pickup',
      deliveryAddress: deliveryAddress || '',
      userNotes: userNotes || '',
    });

    // Populate for response
    await booking.populate('equipmentId', 'name brand images dailyPrice securityDeposit');

    // Create notification for user
    await Notification.create({
      userId: req.user._id,
      title: 'Booking Request Submitted',
      message: `Your rental booking request for ${equipment.name} (${rentalDays} day${rentalDays > 1 ? 's' : ''}) has been submitted and is pending admin approval.`,
      type: 'booking',
      link: '/dashboard/bookings',
    });

    res.status(201).json({
      success: true,
      message: 'Rental booking request submitted successfully. Awaiting approval.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { userId: req.user._id };

    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    const bookings = await Booking.find(query)
      .populate('equipmentId', 'name brand category images dailyPrice securityDeposit condition')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    let bookings = await Booking.find(query)
      .populate('userId', 'name email phone avatar')
      .populate('equipmentId', 'name brand category images dailyPrice securityDeposit')
      .sort({ createdAt: -1 });

    if (search && search.trim()) {
      const term = search.toLowerCase();
      bookings = bookings.filter((b) => {
        const userName = b.userId?.name?.toLowerCase() || '';
        const userEmail = b.userId?.email?.toLowerCase() || '';
        const eqName = b.equipmentId?.name?.toLowerCase() || '';
        return (
          userName.includes(term) ||
          userEmail.includes(term) ||
          eqName.includes(term) ||
          b._id.toString().includes(term)
        );
      });
    }

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('equipmentId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Ensure only booking owner or admin can view
    if (
      booking.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking.',
      });
    }

    // Fetch related payment if any
    const payment = await Payment.findOne({ bookingId: booking._id });

    res.json({
      success: true,
      data: {
        ...booking.toObject(),
        payment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Approve, Reject, Active, Complete)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const validStatuses = ['approved', 'rejected', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const booking = await Booking.findById(req.params.id).populate('equipmentId');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // If approving, verify that no conflict appeared in the meantime
    if (status === 'approved' && booking.bookingStatus !== 'approved') {
      const { hasConflict, conflictingBooking } = await checkBookingOverlap(
        booking.equipmentId._id,
        booking.startDate,
        booking.endDate,
        booking._id
      );

      if (hasConflict) {
        return res.status(409).json({
          success: false,
          message: 'Cannot approve: Equipment already has another active/approved booking in this timeframe.',
          conflictingBooking,
        });
      }
    }

    booking.bookingStatus = status;
    if (adminNotes !== undefined) booking.adminNotes = adminNotes;

    // Track rental completed date
    if (status === 'completed') {
      booking.actualReturnedDate = new Date();
      // Increment equipment total rentals count
      await Equipment.findByIdAndUpdate(booking.equipmentId._id, {
        $inc: { totalRentals: 1 },
      });
    }

    await booking.save();

    // Create user notification
    const statusTitles = {
      approved: 'Booking Approved 🎉',
      rejected: 'Booking Request Rejected',
      active: 'Equipment Handed Over - Rental Active 🚀',
      completed: 'Rental Completed & Returned ✅',
      cancelled: 'Booking Cancelled',
    };

    const statusMessages = {
      approved: `Your booking for ${booking.equipmentId.name} has been approved! You can pick it up on ${new Date(booking.startDate).toLocaleDateString()}.`,
      rejected: `Your booking request for ${booking.equipmentId.name} was rejected. Note: ${adminNotes || 'Equipment unavailable.'}`,
      active: `Your rental period for ${booking.equipmentId.name} is now active. Enjoy your equipment!`,
      completed: `Your rental for ${booking.equipmentId.name} has been marked as returned. Your security deposit of ₹${booking.securityDeposit} will be refunded.`,
      cancelled: `Your booking for ${booking.equipmentId.name} has been cancelled.`,
    };

    await Notification.create({
      userId: booking.userId,
      title: statusTitles[status] || 'Booking Update',
      message: statusMessages[status] || `Status updated to ${status}.`,
      type: 'booking',
      link: '/dashboard/bookings',
    });

    res.json({
      success: true,
      message: `Booking status updated to ${status}.`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    User cancels own eligible booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('equipmentId', 'name');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking.',
      });
    }

    if (!['pending', 'approved'].includes(booking.bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking that is already ${booking.bookingStatus}.`,
      });
    }

    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = reason || 'Cancelled by user';
    await booking.save();

    await Notification.create({
      userId: booking.userId,
      title: 'Booking Cancelled',
      message: `Your booking for ${booking.equipmentId?.name || 'equipment'} has been cancelled.`,
      type: 'booking',
      link: '/dashboard/bookings',
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulate or complete payment for a booking
// @route   POST /api/bookings/:id/pay
// @access  Private
const processBookingPayment = async (req, res, next) => {
  try {
    const { paymentMethod = 'upi', transactionId } = req.body;
    const booking = await Booking.findById(req.params.id).populate('equipmentId', 'name');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const txId = transactionId || `TXN-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const payment = await Payment.create({
      userId: booking.userId,
      bookingId: booking._id,
      amount: booking.totalAmount,
      paymentMethod,
      transactionId: txId,
      paymentStatus: 'completed',
    });

    booking.paymentStatus = 'paid';
    await booking.save();

    await Notification.create({
      userId: booking.userId,
      title: 'Payment Confirmed 💳',
      message: `Payment of ₹${booking.totalAmount.toLocaleString('en-IN')} for ${booking.equipmentId?.name} was successful. Transaction ID: ${txId}`,
      type: 'payment',
      link: '/dashboard/payments',
    });

    res.json({
      success: true,
      message: 'Payment processed successfully.',
      data: {
        booking,
        payment,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  processBookingPayment,
};

