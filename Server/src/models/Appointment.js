const mongoose = require('mongoose');
const { APPOINTMENT_STATUS } = require('../config/constants');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  status: {
    type: String,
    enum: Object.values(APPOINTMENT_STATUS),
    default: APPOINTMENT_STATUS.BOOKED
  },
  reasonForVisit: {
    type: String,
    maxlength: 500
  },
  symptoms: [String],
  fee: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  notes: String,
  cancelReason: String,
  canceledAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Critical unique index to prevent double booking
appointmentSchema.index(
  { doctorId: 1, clinicId: 1, date: 1, slotIndex: 1, status: 1 },
  { 
    unique: true,
    partialFilterExpression: { status: APPOINTMENT_STATUS.BOOKED }
  }
);

// Indexes for queries
appointmentSchema.index({ patientId: 1, date: 1 });
appointmentSchema.index({ doctorId: 1, date: 1 });
appointmentSchema.index({ clinicId: 1, date: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
