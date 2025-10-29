const express = require("express");
const router = express.Router();
const availabilityController = require("../controllers/availabilityController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

// Public routes
router.route("/doctor").get(availabilityController.getDoctorAvailability);
router.route("/doctors").get(availabilityController.getAvailableDoctors);

// Protected routes (doctor/admin)
router
  .route("/generate")
  .post(
    protect,
    authorize("doctor", "admin"),
    availabilityController.generateAvailability
  );

router
  .route("/bulk-generate")
  .post(
    protect,
    authorize("doctor", "admin"),
    availabilityController.bulkGenerateAvailability
  );

router
  .route("/mark-unavailable")
  .put(
    protect,
    authorize("doctor", "admin"),
    availabilityController.markSlotUnavailable
  );

router
  .route("/mark-available")
  .put(
    protect,
    authorize("doctor", "admin"),
    availabilityController.markSlotAvailable
  );

module.exports = router;
