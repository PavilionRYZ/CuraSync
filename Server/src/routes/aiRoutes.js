const express = require("express");
const router = express.Router();
const aiHelperController = require("../controllers/aiHelperController");
const { validate, validationRules } = require("../middlewares/validator");
const { aiChatbotLimiter } = require("../middlewares/rateLimiter");

// Existing routes
router.post(
  "/recommend-doctor",
  validationRules.aiRecommendation,
  validate,
  aiChatbotLimiter,
  aiHelperController.getDoctorRecommendation
);

router.get(
  "/doctor/:doctorId/available-slots",
  aiHelperController.getDoctorAvailableSlots
);

router.post(
  "/chatbot",
  validationRules.chatbot,
  validate,
  aiChatbotLimiter,
  aiHelperController.medicalChatbot
);

router.get("/health-tips", aiHelperController.getHealthTips);

router.get("/compare-doctors", aiHelperController.compareDoctors);

router.get("/emergency-doctors", aiHelperController.getEmergencyDoctors);

router.post(
  "/detailed-analysis",
  validationRules.aiRecommendation,
  validate,
  aiChatbotLimiter,
  aiHelperController.detailedSymptomAnalysis
);

module.exports = router;
