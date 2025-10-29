const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slotIndex: {
    type: Number,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  capacity: {
    type: Number,
    default: 1
  }
}, { _id: false });

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  slots: [slotSchema],
  isHoliday: {
    type: Boolean,
    default: false
  },
  notes: String
}, {
  timestamps: true
});

// Compound unique index for doctor-clinic-date combination
availabilitySchema.index({ doctorId: 1, clinicId: 1, date: 1 }, { unique: true });

// Index for queries
availabilitySchema.index({ clinicId: 1, date: 1 });
availabilitySchema.index({ date: 1 });

module.exports = mongoose.model('DoctorAvailability', availabilitySchema);
