const { model, generationConfig } = require("../config/gemini");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const ResponseHandler = require("../utils/responseHandler");

// ✅ NEW: AI-Powered Doctor Recommendation
exports.getDoctorRecommendation = async (req, res, next) => {
  try {
    const { symptoms, patientAge, patientGender, location, urgency } = req.body;

    if (!symptoms) {
      return ResponseHandler.error(
        res,
        "Please provide symptoms for analysis",
        400
      );
    }

    // AI Analysis
    const analysisPrompt = `
You are a medical AI assistant for CuraSync healthcare platform.

Analyze these patient details:
- Symptoms: ${symptoms}
${patientAge ? `- Age: ${patientAge}` : ""}
${patientGender ? `- Gender: ${patientGender}` : ""}
${urgency ? `- Urgency: ${urgency}` : ""}

Provide:
1. **Symptom Analysis**: Brief professional analysis (2-3 sentences)
2. **Possible Conditions**: 2-3 possible conditions with brief descriptions
3. **Recommended Specialist**: Choose ONE from: General Physician, Cardiologist, Dermatologist, Neurologist, Orthopedic, Pediatrician, Psychiatrist, Gynecologist, Ophthalmologist, ENT Specialist, Dentist, Urologist, Gastroenterologist, Endocrinologist, Oncologist
4. **Urgency Assessment**: Low, Medium, High, or Emergency
5. **Preliminary Advice**: Immediate self-care recommendations (2-3 points)
6. **Warning Signs**: Symptoms requiring immediate medical attention

Format the response clearly with markdown formatting.

IMPORTANT: This is NOT a diagnosis. Always emphasize professional medical consultation is required.
`;

    const chat = model.startChat({ generationConfig, history: [] });
    const result = await chat.sendMessage(analysisPrompt);
    const aiAnalysis = result.response.text();

    // Extract specialization from AI response
    const specializationPatterns = [
      "general physician",
      "cardiologist",
      "dermatologist",
      "neurologist",
      "orthopedic",
      "pediatrician",
      "psychiatrist",
      "gynecologist",
      "ophthalmologist",
      "ent specialist",
      "dentist",
      "urologist",
      "gastroenterologist",
      "endocrinologist",
      "oncologist",
    ];

    let recommendedSpecialization = "general physician";
    const lowerAnalysis = aiAnalysis.toLowerCase();

    for (const spec of specializationPatterns) {
      if (lowerAnalysis.includes(spec)) {
        recommendedSpecialization = spec;
        break;
      }
    }

    // Find matching doctors
    const doctorQuery = {
      isVerified: true,
      isActive: true,
      specialization: { $regex: recommendedSpecialization, $options: "i" },
    };

    // Apply location filter if provided
    if (location) {
      // You can adjust this based on your User model's address structure
      doctorQuery.$or = [
        { "userId.address.city": { $regex: location, $options: "i" } },
        { "userId.address.state": { $regex: location, $options: "i" } },
      ];
    }

    const matchingDoctors = await Doctor.find(doctorQuery)
      .populate("userId", "name email phone address")
      .sort({ rating: -1, totalReviews: -1 })
      .limit(10)
      .lean();

    // Add available slots if your Doctor model has availableSlots field
    const doctorsWithSlots = matchingDoctors.map((doctor) => {
      const doctorObj = { ...doctor };

      // Check if availableSlots exists in your schema
      if (doctor.availableSlots && doctor.availableSlots.length > 0) {
        const availableDates = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() + i);
          const dayName = checkDate.toLocaleDateString("en-US", {
            weekday: "long",
          });

          const daySlots = doctor.availableSlots.filter(
            (slot) => slot.dayOfWeek === dayName
          );

          if (daySlots.length > 0) {
            availableDates.push({
              date: checkDate.toISOString().split("T"),
              dayOfWeek: dayName,
              slots: daySlots,
            });
          }
        }

        doctorObj.upcomingAvailability = availableDates;
      }

      return doctorObj;
    });

    console.log(
      `✅ AI recommendation generated for symptoms: ${symptoms.substring(
        0,
        50
      )}...`
    );

    return ResponseHandler.success(
      res,
      {
        aiAnalysis,
        recommendedSpecialization,
        totalDoctorsFound: doctorsWithSlots.length,
        doctors: doctorsWithSlots,
        disclaimer:
          "⚠️ This AI analysis is for informational purposes only. Always consult with a qualified healthcare provider for proper diagnosis and treatment.",
      },
      "Doctor recommendations generated successfully"
    );
  } catch (error) {
    console.error("❌ AI recommendation error:", error);
    next(error);
  }
};

// ✅ NEW: Get Available Slots for Specific Doctor
exports.getDoctorAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { startDate, endDate } = req.query;

    const doctor = await Doctor.findById(doctorId)
      .populate("userId", "name email phone address")
      .lean();

    if (!doctor) {
      return ResponseHandler.error(res, "Doctor not found", 404);
    }

    if (!doctor.isActive || !doctor.isVerified) {
      return ResponseHandler.error(res, "Doctor is currently unavailable", 400);
    }

    // If no availableSlots field in schema, return basic info
    if (!doctor.availableSlots || doctor.availableSlots.length === 0) {
      return ResponseHandler.success(
        res,
        {
          doctor: {
            id: doctor._id,
            name: doctor.userId?.name,
            specialization: doctor.specialization,
            consultationFee: doctor.consultationFee,
            profileImage: doctor.profileImage,
            rating: doctor.rating,
            totalReviews: doctor.totalReviews,
          },
          message:
            "No available slots configured for this doctor. Please contact the clinic directly.",
        },
        "Doctor information retrieved"
      );
    }

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate
      ? new Date(endDate)
      : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const availableSchedule = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const dayName = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

      const daySlots = doctor.availableSlots.filter(
        (slot) => slot.dayOfWeek === dayName
      );

      if (daySlots.length > 0) {
        availableSchedule.push({
          date: currentDate.toISOString().split("T"),
          dayOfWeek: dayName,
          slots: daySlots,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return ResponseHandler.success(
      res,
      {
        doctor: {
          id: doctor._id,
          name: doctor.userId?.name,
          specialization: doctor.specialization,
          consultationFee: doctor.consultationFee,
          profileImage: doctor.profileImage,
          rating: doctor.rating,
          totalReviews: doctor.totalReviews,
          bio: doctor.bio,
          experience: doctor.experience,
        },
        totalAvailableDays: availableSchedule.length,
        availableSchedule,
      },
      "Available slots fetched successfully"
    );
  } catch (error) {
    console.error("❌ Get slots error:", error);
    next(error);
  }
};

// ✅ NEW: Medical Chatbot
exports.medicalChatbot = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question) {
      return ResponseHandler.error(res, "Please provide a question", 400);
    }

    const systemPrompt = `
You are MediBot, a friendly and knowledgeable medical assistant for CuraSync healthcare platform.

Guidelines:
1. Provide helpful, accurate medical information in simple language
2. Always emphasize you're NOT replacing professional medical advice
3. Encourage consulting healthcare professionals for diagnosis and treatment
4. Be empathetic, supportive, and understanding
5. For emergencies, strongly advise immediate medical attention
6. Keep responses concise (2-4 paragraphs maximum)
7. Use bullet points for lists when appropriate
8. Avoid medical jargon; explain terms simply

User Question: ${question}

Provide a helpful response following the guidelines above.
`;

    const chat = model.startChat({ generationConfig, history: [] });
    const result = await chat.sendMessage(systemPrompt);
    const response = result.response.text();

    console.log(`✅ Chatbot query: ${question.substring(0, 50)}...`);

    return ResponseHandler.success(
      res,
      {
        question,
        response,
        timestamp: new Date().toISOString(),
        disclaimer:
          "⚠️ This is an AI-generated response for informational purposes only. Not a substitute for professional medical advice, diagnosis, or treatment.",
      },
      "Response generated successfully"
    );
  } catch (error) {
    console.error("❌ Chatbot error:", error);
    next(error);
  }
};

// ✅ EXISTING: Get Health Tips by Category
exports.getHealthTips = async (req, res, next) => {
  try {
    const { category = "general", count = 5 } = req.query;

    const validCategories = [
      "general",
      "nutrition",
      "exercise",
      "mental-health",
      "sleep",
      "stress-management",
      "preventive-care",
    ];

    if (!validCategories.includes(category)) {
      return ResponseHandler.error(
        res,
        `Invalid category. Must be one of: ${validCategories.join(", ")}`,
        400
      );
    }

    const prompt = `
Generate ${count} practical, evidence-based health tips for the category: ${category}.

Requirements:
- Each tip should be concise (1-2 sentences)
- Make them actionable and specific
- Use positive, encouraging language
- Include diverse aspects
- Suitable for general audience

Format as a numbered list with clear, professional language.
`;

    const result = await model.generateContent(prompt);
    const tips = result.response.text();

    console.log(`✅ Health tips generated for category: ${category}`);

    return ResponseHandler.success(
      res,
      {
        category,
        count: parseInt(count),
        tips,
        generatedAt: new Date().toISOString(),
      },
      "Health tips generated successfully"
    );
  } catch (error) {
    console.error("❌ Health tips error:", error);
    next(error);
  }
};

// ✅ EXISTING: Compare Doctors by Specialization
exports.compareDoctors = async (req, res, next) => {
  try {
    const { specialization, location, limit = 5 } = req.query;

    if (!specialization) {
      return ResponseHandler.error(res, "Specialization is required", 400);
    }

    let query = {
      isVerified: true,
      isActive: true,
      specialization: { $regex: specialization, $options: "i" },
    };

    const doctors = await Doctor.find(query)
      .populate("userId", "name email phone address")
      .sort({ rating: -1, totalReviews: -1 })
      .limit(parseInt(limit))
      .lean();

    if (doctors.length === 0) {
      return ResponseHandler.success(
        res,
        { doctors: [], count: 0 },
        "No doctors found matching criteria"
      );
    }

    const comparison = doctors.map((doc) => ({
      id: doc._id,
      name: doc.userId?.name,
      specialization: doc.specialization,
      experience: doc.experience,
      consultationFee: doc.consultationFee,
      rating: doc.rating,
      totalReviews: doc.totalReviews,
      location: doc.userId?.address,
      languages: doc.languages,
      profileImage: doc.profileImage,
      bio: doc.bio,
    }));

    console.log(`✅ Doctor comparison generated for: ${specialization}`);

    return ResponseHandler.success(
      res,
      { comparison, count: comparison.length },
      "Doctor comparison generated successfully"
    );
  } catch (error) {
    console.error("❌ Compare doctors error:", error);
    next(error);
  }
};

// ✅ EXISTING: Get Emergency Contacts/Doctors
exports.getEmergencyDoctors = async (req, res, next) => {
  try {
    const { location, limit = 3 } = req.query;

    // Emergency specializations
    const emergencySpecializations = [
      "general physician",
      "cardiologist",
      "neurologist",
    ];

    let query = {
      isVerified: true,
      isActive: true,
      specialization: {
        $in: emergencySpecializations.map((spec) => new RegExp(spec, "i")),
      },
    };

    const doctors = await Doctor.find(query)
      .populate("userId", "name email phone address")
      .sort({ rating: -1 })
      .limit(parseInt(limit))
      .lean();

    const emergencyInfo = doctors.map((doc) => ({
      id: doc._id,
      name: doc.userId?.name,
      phone: doc.userId?.phone,
      specialization: doc.specialization || doc.specialization,
      address: doc.userId?.address,
      consultationFee: doc.consultationFee,
      rating: doc.rating,
      isAvailable: true,
      profileImage: doc.profileImage,
    }));

    console.log(`✅ Emergency doctors found: ${emergencyInfo.length}`);

    return ResponseHandler.success(
      res,
      {
        emergencyDoctors: emergencyInfo,
        count: emergencyInfo.length,
      },
      "Emergency doctors found"
    );
  } catch (error) {
    console.error("❌ Emergency doctors error:", error);
    next(error);
  }
};

// ✅ EXISTING: Detailed Symptom Analysis
exports.detailedSymptomAnalysis = async (req, res, next) => {
  try {
    const {
      symptoms,
      duration,
      severity,
      associatedSymptoms,
      medicalHistory,
      currentMedications,
    } = req.body;

    if (!symptoms || !severity) {
      return ResponseHandler.error(
        res,
        "Symptoms and severity are required",
        400
      );
    }

    const severityLevels = ["mild", "moderate", "severe"];
    if (!severityLevels.includes(severity.toLowerCase())) {
      return ResponseHandler.error(
        res,
        "Severity must be: mild, moderate, or severe",
        400
      );
    }

    const analysisPrompt = `
You are a medical AI assistant for CuraSync. Provide comprehensive symptom analysis.

Patient Details:
- Primary Symptoms: ${symptoms}
${duration ? `- Duration: ${duration}` : ""}
- Severity: ${severity}
${associatedSymptoms ? `- Associated Symptoms: ${associatedSymptoms}` : ""}
${medicalHistory ? `- Medical History: ${medicalHistory}` : ""}
${currentMedications ? `- Current Medications: ${currentMedications}` : ""}

Provide a detailed analysis with the following sections:

1. **Symptom Analysis**: Detailed analysis of the symptoms
2. **Possible Conditions**: List 3-5 possible conditions with brief explanations and estimated probabilities
3. **Severity Assessment**: Professional assessment based on the information provided
4. **Specialist Recommendations**: Top 3 specialists recommended with reasons
5. **When to Seek Emergency Care**: Clear red flags that require immediate medical attention
6. **Self-Care Recommendations**: Practical steps the patient can take at home
7. **Questions for Doctor**: 5-7 important questions to ask healthcare provider
8. **Risk Factors**: Things that might increase severity or complicate condition

Use clear markdown formatting with headers and bullet points.

IMPORTANT: This is preliminary guidance only. Always emphasize that professional medical consultation is essential.
`;

    const chat = model.startChat({ generationConfig, history: [] });
    const result = await chat.sendMessage(analysisPrompt);
    const analysis = result.response.text();

    // Extract severity assessment
    let recommendedUrgency = "medium";
    if (severity.toLowerCase() === "severe") {
      recommendedUrgency = "high";
    } else if (severity.toLowerCase() === "mild") {
      recommendedUrgency = "low";
    }

    console.log(
      `✅ Detailed symptom analysis completed for: ${symptoms.substring(
        0,
        30
      )}...`
    );

    return ResponseHandler.success(
      res,
      {
        analysis,
        urgencyLevel: recommendedUrgency,
        timestamp: new Date().toISOString(),
        disclaimer:
          "⚠️ This analysis is for informational purposes only. Always consult a healthcare provider for proper diagnosis and treatment.",
      },
      "Detailed symptom analysis completed"
    );
  } catch (error) {
    console.error("❌ Detailed symptom analysis error:", error);
    next(error);
  }
};
