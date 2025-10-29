const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { validate, validationRules } = require("../middlewares/validator");
const { authorize } = require("../middlewares/roleMiddleware");

// Public routes
router
  .route("/register")
  .post(validationRules.register, validate, authController.register);
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
