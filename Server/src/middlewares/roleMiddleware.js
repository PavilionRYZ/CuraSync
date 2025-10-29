const ResponseHandler = require("../utils/responseHandler");
const { USER_ROLES } = require("../config/constants");

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log("❌ No user found in request");
      return ResponseHandler.error(res, "Not authorized, please login", 401);
    }

    if (!roles.includes(req.user.role)) {
      console.log(
        `❌ User role '${req.user.role}' not authorized for this route`
      );
      return ResponseHandler.error(
        res,
        `User role '${req.user.role}' is not authorized to access this route`,
        403
      );
    }

    console.log(`✅ User role '${req.user.role}' authorized`);
    next();
  };
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== USER_ROLES.ADMIN) {
    console.log("❌ Admin access required");
    return ResponseHandler.error(res, "Admin access required", 403);
  }

  console.log("✅ Admin access granted");
  next();
};

const isDoctor = (req, res, next) => {
  if (!req.user || req.user.role !== USER_ROLES.DOCTOR) {
    console.log("❌ Doctor access required");
    return ResponseHandler.error(res, "Doctor access required", 403);
  }

  console.log("✅ Doctor access granted");
  next();
};

const isPatient = (req, res, next) => {
  if (!req.user || req.user.role !== USER_ROLES.PATIENT) {
    console.log("❌ Patient access required");
    return ResponseHandler.error(res, "Patient access required", 403);
  }

  console.log("✅ Patient access granted");
  next();
};

module.exports = {
  authorize,
  isAdmin,
  isDoctor,
  isPatient,
};
