const { body, param, query, validationResult } = require("express-validator");
const ResponseHandler = require("../utils/responseHandler");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseHandler.validationError(res, errors.array());
  }
  next();
};

// Validation rules
const validationRules = {
  register: [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone")
      .matches(/^[0-9]{10}$/)
      .withMessage("Valid 10-digit phone number is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["patient", "doctor", "admin"])
      .withMessage("Invalid role"),
    // Optional patient fields
    body("dateOfBirth")
      .optional()
      .isISO8601()
      .withMessage("Valid date of birth required"),
    body("gender")
      .optional()
      .isIn(["male", "female", "other"])
      .withMessage("Invalid gender"),
    body("bloodGroup")
      .optional()
      .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
      .withMessage("Invalid blood group"),
  ],

  login: [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  // OTP Verification
  otpVerification: [
    body("email").isEmail().withMessage("Valid email is required"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage("OTP must be 6 digits"),
  ],

  // Forgot Password
  forgotPassword: [
    body("email").isEmail().withMessage("Valid email is required"),
  ],

  // Reset Password
  resetPassword: [
    body("email").isEmail().withMessage("Valid email is required"),
    body("resetToken").notEmpty().withMessage("Reset token is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],

  createClinic: [
    body("name").trim().notEmpty().withMessage("Clinic name is required"),
    body("address.street").notEmpty().withMessage("Street is required"),
    body("address.city").notEmpty().withMessage("City is required"),
    body("address.state").notEmpty().withMessage("State is required"),
    body("address.zipCode").notEmpty().withMessage("Zip code is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
  ],

  createAffiliation: [
    body("doctorId").isMongoId().withMessage("Valid doctor ID is required"),
    body("clinicId").isMongoId().withMessage("Valid clinic ID is required"),
    body("consultationFee")
      .isNumeric()
      .withMessage("Consultation fee must be a number"),
    body("workingDays").isArray().withMessage("Working days must be an array"),
    body("workingHours.start")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Valid start time required"),
    body("workingHours.end")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Valid end time required"),
  ],

  bookAppointment: [
    body("clinicId").isMongoId().withMessage("Valid clinic ID is required"),
    body("date")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Date must be in YYYY-MM-DD format"),
    body("slotIndex")
      .isInt({ min: 0 })
      .withMessage("Valid slot index is required"),
    body("doctorId")
      .optional()
      .isMongoId()
      .withMessage("Valid doctor ID required"),
  ],

  // AI Recommendation
  aiRecommendation: [
    body("symptoms")
      .notEmpty()
      .withMessage("Symptoms are required")
      .isLength({ min: 10 })
      .withMessage("Please provide detailed symptoms (minimum 10 characters)"),
    body("patientAge")
      .optional()
      .isInt({ min: 1, max: 150 })
      .withMessage("Age must be between 1 and 150"),
    body("patientGender")
      .optional()
      .isIn(["male", "female", "other"])
      .withMessage("Invalid gender"),
    body("urgency")
      .optional()
      .isIn(["low", "medium", "high", "emergency"])
      .withMessage("Invalid urgency level"),
  ],

  // Chatbot
  chatbot: [
    body("question")
      .notEmpty()
      .withMessage("Question is required")
      .isLength({ min: 5, max: 500 })
      .withMessage("Question must be between 5 and 500 characters"),
  ],

  // Doctor Registration (with image validation handled by multer)
  doctorRegistration: [
    body("name").trim().notEmpty().withMessage("Doctor name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("phone")
      .matches(/^[0-9]{10}$/)
      .withMessage("Valid 10-digit phone number is required"),
    body("specialization").notEmpty().withMessage("Specialization is required"),
    body("experience")
      .isInt({ min: 0 })
      .withMessage("Valid experience is required"),
    body("licenseNumber").notEmpty().withMessage("License number is required"),
    body("consultationFee")
      .optional()
      .isNumeric()
      .withMessage("Consultation fee must be a number"),
    // profileImage is validated by multer middleware
  ],

  // Update Profile
  updateProfile: [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("phone")
      .optional()
      .matches(/^[0-9]{10}$/)
      .withMessage("Valid 10-digit phone number required"),
    body("dateOfBirth")
      .optional()
      .isISO8601()
      .withMessage("Valid date of birth required"),
    body("bloodGroup")
      .optional()
      .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
      .withMessage("Invalid blood group"),
    body("gender")
      .optional()
      .isIn(["male", "female", "other"])
      .withMessage("Invalid gender"),
  ],

  // Change Password
  changePassword: [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
};

module.exports = { validate, validationRules };
