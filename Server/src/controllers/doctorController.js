const Doctor = require("../models/Doctor");
const User = require("../models/User");
const DoctorClinicAffiliation = require("../models/DoctorClinicAffiliation");
const ResponseHandler = require("../utils/responseHandler");
const { DEFAULT_PAGE_SIZE, USER_ROLES } = require("../config/constants");

exports.registerDoctor = async (req, res, next) => {
  try {
    // Verify admin authorization
    if (!req.user || req.user.role !== USER_ROLES.ADMIN) {
      return ResponseHandler.error(
        res,
        "Unauthorized. Only admins can register doctors.",
        403
      );
    }

    const {
      name,
      email,
      phone,
      password,
      specialization,
      qualifications,
      experience,
      licenseNumber,
      bio,
      consultationFee,
    } = req.body;

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "password",
      "specialization",
      "experience",
      "licenseNumber",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return ResponseHandler.error(
        res,
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ResponseHandler.error(res, "Email already exists", 409);
    }

    // Check if license number already exists
    const existingLicense = await Doctor.findOne({ licenseNumber });
    if (existingLicense) {
      return ResponseHandler.error(res, "License number already exists", 409);
    }

    // Create user account
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: USER_ROLES.DOCTOR,
      isActive: true,
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      specialization: Array.isArray(specialization)
        ? specialization
        : [specialization],
      qualifications: qualifications || [],
      experience,
      licenseNumber,
      bio: bio || "",
      consultationFee: consultationFee || 0,
      isVerified: req.body.isVerified === true,
      verifiedBy: req.body.isVerified === true ? req.user._id : null,
      verifiedAt: req.body.isVerified === true ? new Date() : null,
    });

    // Populate user details
    await doctor.populate("userId", "name email phone");

    console.log(`✅ Doctor registered by admin: ${req.user.email}`);

    return ResponseHandler.success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        doctor,
      },
      "Doctor registered successfully",
      201
    );
  } catch (error) {
    console.error("❌ Doctor registration error:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {});
      return ResponseHandler.error(res, `${field} already exists`, 409);
    }

    next(error);
  }
};

exports.getAllDoctors = async (req, res, next) => {
  try {
    const {
      specialization,
      clinicId,
      minExperience,
      minRating,
      isVerified,
      page = 1,
      limit = DEFAULT_PAGE_SIZE,
    } = req.query;

    let query = { isActive: true };

    // Apply filters
    if (specialization) {
      query.specialization = { $in: [specialization.toLowerCase()] };
    }

    if (minExperience) {
      query.experience = { $gte: parseInt(minExperience) };
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (isVerified !== undefined) {
      query.isVerified = isVerified === "true";
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let doctors = await Doctor.find(query)
      .populate("userId", "name email phone profilePicture")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ rating: -1, createdAt: -1 });

    // Filter by clinic if provided
    if (clinicId) {
      const affiliations = await DoctorClinicAffiliation.find({
        clinicId,
        status: "active",
      }).select("doctorId");

      const doctorIds = affiliations.map((aff) => aff.doctorId.toString());
      doctors = doctors.filter((doc) => doctorIds.includes(doc._id.toString()));
    }

    const total = await Doctor.countDocuments(query);

    return ResponseHandler.success(
      res,
      {
        doctors,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
      "Doctors fetched successfully"
    );
  } catch (error) {
    console.error("❌ Get doctors error:", error);
    next(error);
  }
};

exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "userId",
      "name email phone profilePicture address"
    );

    if (!doctor) {
      return ResponseHandler.error(res, "Doctor not found", 404);
    }

    // Get affiliated clinics
    const affiliations = await DoctorClinicAffiliation.find({
      doctorId: doctor._id,
      status: "active",
    }).populate("clinicId", "name address phone");

    const response = {
      ...doctor.toObject(),
      affiliatedClinics: affiliations,
    };

    return ResponseHandler.success(
      res,
      response,
      "Doctor fetched successfully"
    );
  } catch (error) {
    console.error("❌ Get doctor error:", error);
    next(error);
  }
};

exports.updateDoctorProfile = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== USER_ROLES.ADMIN) {
      return ResponseHandler.error(
        res,
        "Unauthorized. Only admins can update doctor profiles.",
        403
      );
    }

    const { doctorId } = req.params;
    if (!doctorId) {
      return ResponseHandler.error(res, "Doctor ID is required", 400);
    }

    const allowedUpdates = [
      "specialization",
      "qualifications",
      "experience",
      "licenseNumber",
      "bio",
      "consultationFee",
      "isVerified",
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.isVerified !== undefined) {
      updates.verifiedAt = updates.isVerified ? new Date() : null;
      updates.verifiedBy = updates.isVerified ? req.user._id : null;
    }

    const doctor = await Doctor.findByIdAndUpdate(doctorId, updates, {
      new: true,
      runValidators: true,
    }).populate("userId", "name email phone");

    if (!doctor) {
      return ResponseHandler.error(res, "Doctor not found", 404);
    }

    console.log(`Doctor profile updated by admin: ${req.user.email}`);

    return ResponseHandler.success(
      res,
      doctor,
      "Doctor profile updated successfully"
    );
  } catch (error) {
    console.error("Update doctor profile error:", error);
    if (error.code === 11000) {
      return ResponseHandler.error(res, "License number already exists", 409);
    }
    next(error);
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id }).populate(
      "userId",
      "name email phone profilePicture"
    );

    if (!doctor) {
      return ResponseHandler.error(res, "Doctor profile not found", 404);
    }

    // Get affiliations
    const affiliations = await DoctorClinicAffiliation.find({
      doctorId: doctor._id,
    }).populate("clinicId", "name address phone");

    const response = {
      ...doctor.toObject(),
      affiliations,
    };

    return ResponseHandler.success(
      res,
      response,
      "Profile fetched successfully"
    );
  } catch (error) {
    console.error("❌ Get my profile error:", error);
    next(error);
  }
};

exports.createAffiliation = async (req, res, next) => {
  try {
    const affiliation = await DoctorClinicAffiliation.create(req.body);

    await affiliation.populate("doctorId");
    await affiliation.populate("clinicId", "name address");

    console.log(`✅ Affiliation created by: ${req.user.email}`);

    return ResponseHandler.success(
      res,
      affiliation,
      "Affiliation created successfully",
      201
    );
  } catch (error) {
    console.error("❌ Create affiliation error:", error);
    next(error);
  }
};

exports.getClinicDoctors = async (req, res, next) => {
  try { 
    const { specialization } = req.query;

    const query = {
      clinicId: req.params.clinicId,
      status: "active",
    };

    const affiliations = await DoctorClinicAffiliation.find(query)
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name email phone profilePicture" },
      })
      .populate("clinicId", "name address");

    let doctors = affiliations.map((aff) => ({
      doctor: aff.doctorId,
      affiliation: {
        fee: aff.consultationFee,
        workingDays: aff.workingDays,
        workingHours: aff.workingHours,
        roomNumber: aff.roomNumber,
        department: aff.department,
      },
    }));

    if (specialization) {
      doctors = doctors.filter(
        (d) =>
          d.doctor &&
          d.doctor.specialization &&
          d.doctor.specialization.includes(specialization.toLowerCase())
      );
    }

    return ResponseHandler.success(
      res,
      doctors,
      "Clinic doctors fetched successfully"
    );
  } catch (error) {
    console.error("❌ Get clinic doctors error:", error);
    next(error);
  }
};

exports.updateAffiliation = async (req, res, next) => {
  try {
    const affiliation = await DoctorClinicAffiliation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("doctorId")
      .populate("clinicId", "name address");

    if (!affiliation) {
      return ResponseHandler.error(res, "Affiliation not found", 404);
    }

    console.log(`✅ Affiliation updated by: ${req.user.email}`);

    return ResponseHandler.success(
      res,
      affiliation,
      "Affiliation updated successfully"
    );
  } catch (error) {
    console.error("❌ Update affiliation error:", error);
    next(error);
  }
};

exports.deleteAffiliation = async (req, res, next) => {
  try {
    const affiliation = await DoctorClinicAffiliation.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    );

    if (!affiliation) {
      return ResponseHandler.error(res, "Affiliation not found", 404);
    }

    console.log(`✅ Affiliation deleted by: ${req.user.email}`);

    return ResponseHandler.success(
      res,
      null,
      "Affiliation deleted successfully"
    );
  } catch (error) {
    console.error("❌ Delete affiliation error:", error);
    next(error);
  }
};
