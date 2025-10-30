const ResponseHandler = require("../utils/responseHandler");

exports.errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return ResponseHandler.error(res, messages.join(", "), 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {});
    return ResponseHandler.error(res, `${field} already exists`, 409);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return ResponseHandler.error(res, "Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    return ResponseHandler.error(res, "Token expired", 401);
  }

  // Multer file upload errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return ResponseHandler.error(
        res,
        "File size too large. Maximum 5MB allowed.",
        400
      );
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return ResponseHandler.error(res, "Too many files uploaded", 400);
    }
    return ResponseHandler.error(res, `File upload error: ${err.message}`, 400);
  }

  // Cloudinary errors
  if (err.message && err.message.includes("cloudinary")) {
    return ResponseHandler.error(
      res,
      "Image upload failed. Please try again.",
      500
    );
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  ResponseHandler.error(res, message, statusCode);
};

module.exports = exports;
