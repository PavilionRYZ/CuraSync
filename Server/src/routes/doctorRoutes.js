const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const { validate, validationRules } = require("../middlewares/validator");

// Public routes
//👍
router.route("/get/all").get(doctorController.getAllDoctors);
//👍
router.route("/doc/:id").get(doctorController.getDoctorById);
router
  .route("/clinics/:clinicId/doctors")
  .get(doctorController.getClinicDoctors);

// Protected routes
//Admin only
//👍
router
  .route("/register/doctor")
  .post(protect, authorize("admin"), doctorController.registerDoctor);

//doctor only
//👍
router.put(
  "/profile/update/:doctorId",
  protect,
  authorize("admin"),
  doctorController.updateDoctorProfile
);

//👍
router
  .route("/doctor/me")
  .get(protect, authorize("doctor"), doctorController.getMyProfile);

// Affiliation routes (admin/doctor)
//👍
router
  .route("/affiliations/create")
  .post(
    protect,
    authorize("admin"),
    validationRules.createAffiliation,
    validate,
    doctorController.createAffiliation
  );

//👍
router
  .route("/affiliation/update/:id")
  .put(protect, authorize("admin"), doctorController.updateAffiliation);

//👍
router
  .route("/affiliations/delete/:id")
  .delete(protect, authorize("admin"), doctorController.deleteAffiliation);

module.exports = router;
