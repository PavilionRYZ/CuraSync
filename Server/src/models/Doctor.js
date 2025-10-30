const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
      index: true,
    },
    specialization: [
      {
        type: String,
        required: [true, "At least one specialization is required"],
        trim: true,
        lowercase: true,
      },
    ],
    qualifications: [
      {
        degree: {
          type: String,
          trim: true,
          required: [true, "Degree is required in qualifications"],
        },
        institution: {
          type: String,
          trim: true,
          required: [true, "Institution is required in qualifications"],
        },
        year: {
          type: Number,
          min: [1900, "Year must be after 1900"],
          max: [new Date().getFullYear(), `Year cannot be in the future`],
          required: [true, "Year is required in qualifications"],
        },
      },
    ],
    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Experience must be a whole number",
      },
    },
    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
      validate: {
        validator: function (v) {
          return /^[A-Z0-9-]+$/.test(v);
        },
        message:
          "License number can only contain letters, numbers, and hyphens",
      },
    },
    profileImage: {
      url: {
        type: String,
        required: [true, "Profile image is required"],
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
      default: "",
    },
    consultationFee: {
      type: Number,
      default: 0,
      min: [0, "Consultation fee cannot be negative"],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, "Total reviews cannot be negative"],
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    languages: [String],
    availableSlots: [
      {
        dayOfWeek: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        startTime: String,
        endTime: String,
        maxPatients: {
          type: Number,
          default: 20,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for fast lookups
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ isVerified: 1, rating: -1 });
doctorSchema.index({ isActive: 1, isVerified: 1 });

// Text index for search functionality
doctorSchema.index(
  {
    bio: "text",
    specialization: "text",
  },
  {
    weights: {
      specialization: 10,
      bio: 5,
    },
  }
);

// Virtual field for populated user name
doctorSchema.virtual("fullName").get(function () {
  return this.userId && this.userId.name ? this.userId.name : undefined;
});

// Pre-save middleware
doctorSchema.pre("save", function (next) {
  if (this.isModified("isVerified") && this.isVerified && !this.verifiedAt) {
    this.verifiedAt = new Date();
  }

  if (this.isModified("isVerified") && !this.isVerified) {
    this.verifiedAt = null;
    this.verifiedBy = null;
  }

  next();
});

// Instance method: Check if doctor can practice
doctorSchema.methods.canPractice = function () {
  return this.isActive && this.isVerified;
};

// Static method: Find verified doctors
doctorSchema.statics.findVerified = function (filters = {}) {
  return this.find({
    isVerified: true,
    isActive: true,
    ...filters,
  }).populate("userId", "name email phone");
};

// Static method: Search doctors
doctorSchema.statics.searchDoctors = function (searchText) {
  return this.find(
    { $text: { $search: searchText }, isActive: true },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .populate("userId", "name email phone");
};

module.exports = mongoose.model("Doctor", doctorSchema);
