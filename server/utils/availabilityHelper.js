const Booking = require('../models/Booking');

/**
 * Calculates inclusive rental days between start and end dates.
 * Minimum 1 day.
 */
const calculateDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Normalize to midnight UTC to avoid timezone off-by-one errors
  const s = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
  const e = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));

  const diffTime = e.getTime() - s.getTime();
  if (diffTime < 0) return 0;

  // Add 1 day for inclusive rental (e.g. Oct 1 to Oct 3 is 3 days: Oct 1, 2, 3)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diffDays);
};

/**
 * Validates whether the requested dates overlap with an already approved or active booking.
 * Overlap condition:
 * Existing booking [existStart, existEnd] overlaps with [reqStart, reqEnd] if:
 * reqStart <= existEnd AND reqEnd >= existStart
 */
const checkBookingOverlap = async (equipmentId, startDate, endDate, excludeBookingId = null) => {
  const reqStart = new Date(startDate);
  const reqEnd = new Date(endDate);

  const query = {
    equipmentId,
    bookingStatus: { $in: ['approved', 'active'] },
    startDate: { $lte: reqEnd },
    endDate: { $gte: reqStart },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await Booking.findOne(query).select('startDate endDate bookingStatus').lean();

  return {
    hasConflict: !!conflictingBooking,
    conflictingBooking: conflictingBooking || null,
  };
};

/**
 * Retrieves all approved/active booking periods for an equipment item to display on calendar.
 */
const getEquipmentBookedRanges = async (equipmentId) => {
  const bookings = await Booking.find({
    equipmentId,
    bookingStatus: { $in: ['approved', 'active'] },
    endDate: { $gte: new Date() },
  })
    .select('startDate endDate bookingStatus')
    .sort({ startDate: 1 })
    .lean();

  return bookings.map(b => ({
    startDate: b.startDate,
    endDate: b.endDate,
    status: b.bookingStatus,
  }));
};

module.exports = {
  calculateDays,
  checkBookingOverlap,
  getEquipmentBookedRanges,
};

