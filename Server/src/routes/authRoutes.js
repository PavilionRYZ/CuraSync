const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { validate, validationRules } = require("../middlewares/validator");
const { authorize } = require("../middlewares/roleMiddleware");
const {
  forgotPasswordLimiter,
  otpVerificationLimiter,
  registrationLimiter,
} = require("../middlewares/rateLimiter");

// Public routes with rate limiting
router
  .route("/register")
  .post(
    registrationLimiter,
    validationRules.register,
    validate,
    authController.register
  );

// OTP verification routes
router.post("/verify-otp", otpVerificationLimiter, authController.verifyOTP);

router.post("/resend-otp", authController.resendOTP);

// Forgot password routes with rate limiting
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  authController.forgotPassword
);

router.post(
  "/verify-reset-otp",
  otpVerificationLimiter,
  authController.verifyResetOTP
);

router.post("/reset-password", authController.resetPassword);
router.post("/resend-reset-otp", authController.resendResetOTP);

router
  .route("/login")
  .post(validationRules.login, validate, authController.login);

router.route("/logout").post(protect, authController.logout);

// Protected routes
router.route("/profile").get(protect, authController.getProfile);
router.route("/profile/update").put(protect, authController.updateProfile);
router.route("/change-password").put(protect, authController.changePassword);

router
  .route("/register/admin")
  .post(
    protect,
    authorize("admin"),
    validationRules.register,
    validate,
    authController.createAdmin
  );

module.exports = router;
