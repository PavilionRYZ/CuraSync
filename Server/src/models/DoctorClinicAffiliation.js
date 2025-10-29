const mongoose = require("mongoose");
const { AFFILIATION_STATUS } = require("../config/constants");

const affiliationSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AFFILIATION_STATUS),
      default: AFFILIATION_STATUS.ACTIVE,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    workingDays: [
      {
        type: String,
        enum: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      },
    ],
    workingHours: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    roomNumber: String,
    department: String,
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate affiliations
affiliationSchema.index({ doctorId: 1, clinicId: 1 }, { unique: true });

// Index for queries
affiliationSchema.index({ clinicId: 1, status: 1 });
affiliationSchema.index({ doctorId: 1, status: 1 });

module.exports = mongoose.model("DoctorClinicAffiliation", affiliationSchema);
