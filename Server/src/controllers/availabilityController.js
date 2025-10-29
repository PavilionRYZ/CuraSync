const {
  generateAvailability,
  getAvailableSlots,
  findFreeDoctors,
  markSlotUnavailable,
  markSlotAvailable,
  bulkGenerateAvailability,
} = require("../services/availabilityService");
const ResponseHandler = require("../utils/responseHandler");
const { formatDate } = require("../utils/slotHelper");


exports.generateAvailability = async (req, res, next) => {
  try {
    const { doctorId, clinicId, date } = req.body;

    if (!doctorId || !clinicId || !date) {
      return ResponseHandler.error(
        res,
        "doctorId, clinicId, and date are required",
        400
      );
    }

    const availability = await generateAvailability(doctorId, clinicId, date);

    if (!availability) {
      return ResponseHandler.error(
        res,
        "Doctor does not work on this day",
        400
      );
    }

    ResponseHandler.success(
      res,
      availability,
      "Availability generated successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

exports.bulkGenerateAvailability = async (req, res, next) => {
  try {
    const { doctorId, clinicId, dates } = req.body;

    if (!doctorId || !clinicId || !Array.isArray(dates) || dates.length === 0) {
      return ResponseHandler.error(
        res,
        "doctorId, clinicId, and dates array are required",
        400
      );
    }

    const results = await bulkGenerateAvailability(doctorId, clinicId, dates);

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    ResponseHandler.success(
      res,
      {
        results,
        summary: {
          total: results.length,
          successful,
          failed,
        },
      },
      "Bulk availability generation completed"
    );
  } catch (error) {
    next(error);
  }
};

exports.getDoctorAvailability = async (req, res, next) => {
  try {
    const { doctorId, clinicId, date } = req.query;

    if (!doctorId || !clinicId || !date) {
      return ResponseHandler.error(
        res,
        "doctorId, clinicId, and date are required",
        400
      );
    }

    const availableSlots = await getAvailableSlots(doctorId, clinicId, date);

    ResponseHandler.success(
      res,
      {
        doctorId,
        clinicId,
        date,
        slots: availableSlots,
        totalSlots: availableSlots.length,
      },
      "Available slots fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};

exports.getAvailableDoctors = async (req, res, next) => {
  try {
    const { clinicId, date, slotIndex, specialization } = req.query;

    if (!clinicId || !date || slotIndex === undefined) {
      return ResponseHandler.error(
        res,
        "clinicId, date, and slotIndex are required",
        400
      );
    }

    const availableDoctors = await findFreeDoctors(
      clinicId,
      date,
      parseInt(slotIndex),
      specialization || null
    );

    if (availableDoctors.length === 0) {
      return ResponseHandler.success(
        res,
        {
          doctors: [],
          totalAvailable: 0,
        },
        "No doctors available for this slot"
      );
    }

    ResponseHandler.success(
      res,
      {
        clinicId,
        date,
        slotIndex: parseInt(slotIndex),
        doctors: availableDoctors,
        totalAvailable: availableDoctors.length,
      },
      "Available doctors fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};

exports.markSlotUnavailable = async (req, res, next) => {
  try {
    const { doctorId, clinicId, date, slotIndex } = req.body;

    if (!doctorId || !clinicId || !date || slotIndex === undefined) {
      return ResponseHandler.error(res, "All fields are required", 400);
    }

    const availability = await markSlotUnavailable(
      doctorId,
      clinicId,
      date,
      slotIndex
    );

    ResponseHandler.success(res, availability, "Slot marked as unavailable");
  } catch (error) {
    ResponseHandler.error(res, error.message, 400);
  }
};

exports.markSlotAvailable = async (req, res, next) => {
  try {
    const { doctorId, clinicId, date, slotIndex } = req.body;

    if (!doctorId || !clinicId || !date || slotIndex === undefined) {
      return ResponseHandler.error(res, "All fields are required", 400);
    }

    const availability = await markSlotAvailable(
      doctorId,
      clinicId,
      date,
      slotIndex
    );

    ResponseHandler.success(res, availability, "Slot marked as available");
  } catch (error) {
    ResponseHandler.error(res, error.message, 400);
  }
};
