const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Clinic name is required'],
    trim: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  phone: {
    type: String,
    required: true
  },
  email: String,
  workingHours: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String }
  },
  facilities: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create 2dsphere index for location-based queries
clinicSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Clinic', clinicSchema);
