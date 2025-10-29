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
} = require("../services/bookingService");
const Doctor = require("../models/Doctor");
const ResponseHandler = require("../utils/responseHandler");
const {
  DEFAULT_PAGE_SIZE,
  APPOINTMENT_STATUS,
} = require("../config/constants");

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
