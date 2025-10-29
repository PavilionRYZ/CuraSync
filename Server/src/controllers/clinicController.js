const Clinic = require("../models/Clinic");
const ResponseHandler = require("../utils/responseHandler");
const { DEFAULT_PAGE_SIZE } = require("../config/constants");

exports.createClinic = async (req, res, next) => {
  try {
    const clinic = await Clinic.create(req.body);
    ResponseHandler.success(res, clinic, "Clinic created successfully", 201);
  } catch (error) {
    next(error);
  }
};//👍

exports.getAllClinics = async (req, res, next) => {
  try {
    const {
      city,
      state,
      search,
      page = 1,
      limit = DEFAULT_PAGE_SIZE,
    } = req.query;
    const query = { isActive: true };

    // Apply filters
    if (city) query["address.city"] = new RegExp(city, "i");
    if (state) query["address.state"] = new RegExp(state, "i");
    if (search) query.name = new RegExp(search, "i");

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Clinic.countDocuments(query);

    const clinics = await Clinic.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });

    ResponseHandler.success(
      res,
      {
        clinics,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
      "Clinics fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};//👍

exports.getClinicById = async (req, res, next) => {
  try {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return ResponseHandler.error(res, "Clinic not found", 404);
    }

    ResponseHandler.success(res, clinic, "Clinic fetched successfully");
  } catch (error) {
    next(error);
  }
};//👍

exports.updateClinic = async (req, res, next) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!clinic) {
      return ResponseHandler.error(res, "Clinic not found", 404);
    }

    ResponseHandler.success(res, clinic, "Clinic updated successfully");
  } catch (error) {
    next(error);
  }
};//👍

exports.deleteClinic = async (req, res, next) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!clinic) {
      return ResponseHandler.error(res, "Clinic not found", 404);
    }

    ResponseHandler.success(res, null, "Clinic deleted successfully");
  } catch (error) {
    next(error);
  }
};//👍

exports.getNearbyClinic = async (req, res, next) => {
  try {
    const { latitude, longitude, maxDistance = 10000 } = req.query;

    if (!latitude || !longitude) {
      return ResponseHandler.error(
        res,
        "Latitude and longitude are required",
        400
      );
    }

    const clinics = await Clinic.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });

    ResponseHandler.success(
      res,
      clinics,
      "Nearby clinics fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};//👍
