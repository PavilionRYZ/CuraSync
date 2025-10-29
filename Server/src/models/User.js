const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { USER_ROLES } = require("../config/constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.PATIENT,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profilePicture: String,
    dateOfBirth: Date,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
