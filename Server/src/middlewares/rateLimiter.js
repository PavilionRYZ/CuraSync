const rateLimit = require("express-rate-limit");

// Rate limiter for forgot password
exports.forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 attempts per 15 minutes
  message: {
    success: false,
    message:
      "Too many password reset attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user && req.user.role === "admin", // Admins bypass
});

// Rate limiter for OTP verification
exports.otpVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many OTP verification attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for registration
exports.registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again after 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for AI chatbot
exports.aiChatbotLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    message: "Too many AI requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for AI recommendations
exports.aiRecommendationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    message: "Too many recommendation requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = exports;
