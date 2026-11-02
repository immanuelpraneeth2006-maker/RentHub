const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Rental start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'Rental end date is required'],
    },
    rentalDays: {
      type: Number,
      required: true,
      min: [1, 'Rental period must be at least 1 day'],
    },
    rentalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    deliveryType: {
      type: String,
      enum: ['store_pickup', 'home_delivery'],
      default: 'store_pickup',
    },
    deliveryAddress: {
      type: String,
      default: '',
    },
    userNotes: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    actualReturnedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes to speed up double-booking conflict checks
bookingSchema.index({ equipmentId: 1, bookingStatus: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

