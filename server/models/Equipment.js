const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    modelNumber: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [String],
      required: [true, 'At least one equipment image is required'],
      validate: [val => val.length > 0, 'Must have at least one image'],
    },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    dailyPrice: {
      type: Number,
      required: [true, 'Daily rental price is required'],
      min: [0, 'Price cannot be negative'],
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: [0, 'Deposit cannot be negative'],
    },
    condition: {
      type: String,
      enum: ['Brand New', 'Like New', 'Excellent', 'Good'],
      default: 'Like New',
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    totalRentals: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 5.0,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: 'Main Hub',
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for fast search
equipmentSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

module.exports = mongoose.model('Equipment', equipmentSchema);

