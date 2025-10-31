const {
  bookAppointmentAuto,
  bookAppointmentSpecific,
  cancelAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getClinicAppointments,
  updateAppointmentStatus,
  rescheduleAppointment,
  getAppointmentById,
  checkDuplicateAppointment,
  getAppointmentHistory,
  getUpcomingAppointments,
  getPastAppointments,
  getAppointmentStats,
  getPatientAppointmentStats,
  getDoctorAppointmentStats,
} = require("../services/bookingService");
const Doctor = require("../models/Doctor");
const ResponseHandler = require("../utils/responseHandler");
const {
  DEFAULT_PAGE_SIZE,
  APPOINTMENT_STATUS,
} = require("../config/constants");

// ✅ Book appointment with auto-allocated doctor
exports.bookAppointmentAuto = async (req, res, next) => {
  try {
    const { clinicId, date, slotIndex, preferences } = req.body;
    const patientId = req.user._id;

    // Validate required fields
    if (!clinicId || !date || slotIndex === undefined) {
      return ResponseHandler.error(
        res,
        "clinicId, date, and slotIndex are required",
        400
      );
    }

    const appointment = await bookAppointmentAuto(
      patientId,
      clinicId,
      date,
      slotIndex,
      preferences
    );

    ResponseHandler.success(
      res,
      appointment,
      "Appointment booked successfully",
      201
    );
  } catch (error) {
    ResponseHandler.error(res, error.message, 400);
  }
};

// ✅ Book appointment with specific doctor
exports.bookAppointmentSpecific = async (req, res, next) => {
  try {
    const { clinicId, doctorId, date, slotIndex, reasonForVisit, symptoms } =
      req.body;
    const patientId = req.user._id;

    // Validate required fields
    if (!clinicId || !doctorId || !date || slotIndex === undefined) {
      return ResponseHandler.error(
        res,
        "clinicId, doctorId, date, and slotIndex are required",
        400
      );
    }

    // Check for duplicate appointments
    const isDuplicate = await checkDuplicateAppointment(
      patientId,
      doctorId,
      date
    );
    if (isDuplicate) {
      return ResponseHandler.error(
        res,
        "You already have an appointment with this doctor on this date",
        400
      );
    }

    const appointment = await bookAppointmentSpecific(
      patientId,
      doctorId,
      clinicId,
      date,
      slotIndex,
      { reasonForVisit, symptoms }
    );

    ResponseHandler.success(
      res,
      appointment,
      "Appointment booked successfully",
      201
    );
  } catch (error) {
    ResponseHandler.error(res, error.message, 400);
  }
};

// Get appointment history for logged-in patient
exports.getAppointmentHistory = async (req, res, next) => {
  try {
    const {
      status,
      fromDate,
      toDate,
      sortBy = "date",
      sortOrder = "desc",
      page = 1,
      limit = DEFAULT_PAGE_SIZE,
    } = req.query;
    const patientId = req.user._id;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filters = {
      status: status || null,
      fromDate: fromDate || null,
      toDate: toDate || null,
    };

    const sortOptions = {};
    if (sortBy === "date") {
      sortOptions.date = sortOrder === "asc" ? 1 : -1;
      sortOptions.slotIndex = 1;
    } else if (sortBy === "status") {
      sortOptions.status = 1;
      sortOptions.date = -1;
    } else if (sortBy === "fee") {
      sortOptions.fee = sortOrder === "asc" ? 1 : -1;
    }

    let appointments = await getAppointmentHistory(
      patientId,
      filters,
      sortOptions
    );

    // Apply pagination
    const total = appointments.length;
    const paginatedAppointments = appointments.slice(
      skip,
      skip + parseInt(limit)
    );

    console.log(`✅ Appointment history fetched for patient: ${patientId}`);

    ResponseHandler.success(
      res,
      {
        appointments: paginatedAppointments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
      "Appointment history fetched successfully"
    );
  } catch (error) {
    console.error("❌ Get appointment history error:", error);
    next(error);
  }
};

// Get upcoming appointments for patient
exports.getUpcomingAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = DEFAULT_PAGE_SIZE } = req.query;
    const patientId = req.user._id;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let appointments = await getUpcomingAppointments(patientId);

    const total = appointments.length;
    const paginatedAppointments = appointments.slice(
      skip,
      skip + parseInt(limit)
    );

    console.log(`✅ Upcoming appointments fetched for patient: ${patientId}`);

    ResponseHandler.success(
      res,
      {
        appointments: paginatedAppointments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
      "Upcoming appointments fetched successfully"
    );
  } catch (error) {
    console.error("❌ Get upcoming appointments error:", error);
    next(error);
  }
};

// Get past appointments for patient
exports.getPastAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = DEFAULT_PAGE_SIZE, sortBy = "date" } = req.query;
    const patientId = req.user._id;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let appointments = await getPastAppointments(patientId, sortBy);

    const total = appointments.length;
    const paginatedAppointments = appointments.slice(
      skip,
      skip + parseInt(limit)
    );

    console.log(`✅ Past appointments fetched for patient: ${patientId}`);

    ResponseHandler.success(
      res,
      {
        appointments: paginatedAppointments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
      "Past appointments fetched successfully"
    );
  } catch (error) {
    console.error("❌ Get past appointments error:", error);
    next(error);
  }
};

// Get patient appointment statistics
exports.getPatientAppointmentStats = async (req, res, next) => {
  try {
    const patientId = req.user._id;

    const stats = await getPatientAppointmentStats(patientId);

    console.log(`✅ Appointment stats fetched for patient: ${patientId}`);

    ResponseHandler.success(
      res,
      stats,
      "Patient appointment statistics fetched successfully"
    );
  } catch (error) {
    console.error("❌ Get patient stats error:", error);
    next(error);
  }
};

// ✅ Get all my appointments (existing - kept for compatibility)
exports.getMyAppointments = async (req, res, next) => {
  try {
    const {
      status,
      fromDate,
      toDate,
      page = 1,
      limit = DEFAULT_PAGE_SIZE,
    } = req.query;
    const patientId = req.user._id;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filters = {
      status: status || null,
      fromDate: fromDate || null,
      toDate: toDate || null,
    };

    let appointments = await getPatientAppointments(patientId, filters);

    // Apply pagination
    const total = appointments.length;
    appointments = appointments.slice(skip, skip + parseInt(limit));

    ResponseHandler.success(
      res,
      {
        appointments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
      "Appointments fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};

// ✅ Get doctor appointments
exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const {
      status,
      date,
      fromDate,
      toDate,
      page = 1,
      limit = DEFAULT_PAGE_SIZE,
    } = req.query;

    // Get doctor ID from user
    const doctor = await Doctor.findOne({ userId: req.user._id });

    if (!doctor) {
      return ResponseHandler.error(res, "Doctor profile not found", 404);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filters = {
      status: status || null,
      date: date || null,
      fromDate: fromDate || null,
      toDate: toDate || null,
    };

    let appointments = await getDoctorAppointments(doctor._id, filters);

    // Apply pagination
    const total = appointments.length;
    appointments = appointments.slice(skip, skip + parseInt(limit));

    ResponseHandler.success(
      res,
      {
        appointments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
      "Appointments fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Get doctor appointment statistics
exports.getDoctorAppointmentStats = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });

    if (!doctor) {
      return ResponseHandler.error(res, "Doctor profile not found", 404);
    }

    const stats = await getDoctorAppointmentStats(doctor._id);

    console.log(`✅ Appointment stats fetched for doctor: ${doctor._id}`);

    ResponseHandler.success(
      res,
      stats,
      "Doctor appointment statistics fetched successfully"
    );
  } catch (error) {
    console.error("❌ Get doctor stats error:", error);
    next(error);
  }
};

// ✅ Get clinic appointments
exports.getClinicAppointments = async (req, res, next) => {
  try {
    const { clinicId } = req.params;
    const {
      status,
      date,
      fromDate,
      toDate,
      page = 1,
      limit = DEFAULT_PAGE_SIZE,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filters = {
      status: status || null,
      date: date || null,
      fromDate: fromDate || null,
      toDate: toDate || null,
    };

    let appointments = await getClinicAppointments(clinicId, filters);

    // Apply pagination
    const total = appointments.length;
    appointments = appointments.slice(skip, skip + parseInt(limit));

    ResponseHandler.success(
      res,
      {
        appointments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
      "Appointments fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};

// ✅ Cancel appointment
exports.cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    const appointment = await cancelAppointment(
      id,
      userId,
      userRole,
      cancelReason
    );

    ResponseHandler.success(
      res,
      appointment,
      "Appointment canceled successfully"
    );
  } catch (error) {
    ResponseHandler.error(res, error.message, 400);
  }
};

// ✅ Update appointment status
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Validate status
    if (!Object.values(APPOINTMENT_STATUS).includes(status)) {
      return ResponseHandler.error(res, "Invalid appointment status", 400);
    }

    const appointment = await updateAppointmentStatus(id, status, notes);

    ResponseHandler.success(
      res,
      appointment,
      "Appointment status updated successfully"
    );
  } catch (error) {
    ResponseHandler.error(res, error.message, 400);
  }
};

// ✅ Reschedule appointment
exports.rescheduleAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newDate, newSlotIndex } = req.body;
    const userId = req.user._id;

    if (!newDate || newSlotIndex === undefined) {
      return ResponseHandler.error(
        res,
        "newDate and newSlotIndex are required",
        400
      );
    }

    // Verify ownership
    const appointment = await getAppointmentById(id);
    if (appointment.patientId._id.toString() !== userId.toString()) {
      return ResponseHandler.error(
        res,
        "Not authorized to reschedule this appointment",
        403
      );
    }

    const rescheduledAppointment = await rescheduleAppointment(
      id,
      newDate,
      newSlotIndex
    );

    ResponseHandler.success(
      res,
      rescheduledAppointment,
      "Appointment rescheduled successfully"
    );
  } catch (error) {
    ResponseHandler.error(res, error.message, 400);
  }
};

// ✅ Get appointment by ID
exports.getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await getAppointmentById(id);

    ResponseHandler.success(
      res,
      appointment,
      "Appointment fetched successfully"
    );
  } catch (error) {
    ResponseHandler.error(res, error.message, 404);
  }
};

// ✅ Get system-wide appointment stats (admin only)
exports.getAppointmentStats = async (req, res, next) => {
  try {
    const Appointment = require("../models/Appointment");

    const stats = {
      totalAppointments: await Appointment.countDocuments(),
      bookedAppointments: await Appointment.countDocuments({
        status: APPOINTMENT_STATUS.BOOKED,
      }),
      completedAppointments: await Appointment.countDocuments({
        status: APPOINTMENT_STATUS.COMPLETED,
      }),
      canceledAppointments: await Appointment.countDocuments({
        status: APPOINTMENT_STATUS.CANCELED,
      }),
      noShowAppointments: await Appointment.countDocuments({
        status: APPOINTMENT_STATUS.NO_SHOW,
      }),
    };

    ResponseHandler.success(res, stats, "Statistics fetched successfully");
  } catch (error) {
    next(error);
  }
};
