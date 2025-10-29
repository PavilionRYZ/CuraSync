const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const { validate, validationRules } = require("../middlewares/validator");

// Patient routes
router
  .route("/book-auto")
  .post(
    protect,
    authorize("patient"),
    validationRules.bookAppointment,
    validate,
    appointmentController.bookAppointmentAuto
  );

router
  .route("/book")
  .post(
    protect,
    authorize("patient"),
    validationRules.bookAppointment,
    validate,
    appointmentController.bookAppointmentSpecific
  );

router
  .route("/my-appointments")
  .get(protect, authorize("patient"), appointmentController.getMyAppointments);

router
  .route("/:id/cancel")
  .patch(
    protect,
    authorize("patient"),
    appointmentController.cancelAppointment
  );

router
  .route("/:id/reschedule")
  .patch(
    protect,
    authorize("patient"),
    appointmentController.rescheduleAppointment
  );

// Doctor routes
router
  .route("/doctor/appointments")
  .get(
    protect,
    authorize("doctor"),
    appointmentController.getDoctorAppointments
  );

router
  .route("/:id/status")
  .patch(
    protect,
    authorize("doctor", "admin"),
    appointmentController.updateAppointmentStatus
  );

// Admin routes
router
  .route("/clinic/:clinicId")
  .get(
    protect,
    authorize("admin"),
    appointmentController.getClinicAppointments
  );

router
  .route("/stats/dashboard")
  .get(protect, authorize("admin"), appointmentController.getAppointmentStats);

// Get appointment by ID
router
  .route("/appointment/:id")
  .get(protect, appointmentController.getAppointmentById);

module.exports = router;
