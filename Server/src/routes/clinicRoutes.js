const express = require("express");
const router = express.Router();
const clinicController = require("../controllers/clinicController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const { validate, validationRules } = require("../middlewares/validator");

// Public routes
router.route("/get/all").get(clinicController.getAllClinics);
router.route("/nearby").get(clinicController.getNearbyClinic);
router.route("/:id").get(clinicController.getClinicById);

// Admin routes
router
  .route("/clinic/create")
  .post(
    protect,
    authorize("admin"),
    validationRules.createClinic,
    validate,
    clinicController.createClinic
  );

router
  .route("/update/:id")
  .put(protect, authorize("admin"), clinicController.updateClinic);

router.delete(
  "/delete/:id",
  protect,
  authorize("admin"),
  clinicController.deleteClinic
);

module.exports = router;
