const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ResponseHandler = require("../utils/responseHandler");

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
      console.log("✅ Token found in cookies");
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ");
      console.log("✅ Token found in Authorization header");
    }

    if (!token) {
      console.log("❌ No token found in cookies or headers");
      return ResponseHandler.error(
        res,
        "Not authorized, no token provided",
        401
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.log("❌ User not found from token");
        return ResponseHandler.error(res, "User not found", 401);
      }

      if (!req.user.isActive) {
        console.log("❌ User account is inactive");
        return ResponseHandler.error(res, "User account is inactive", 401);
      }

      console.log(
        `✅ User authenticated: ${req.user.email} (${req.user.role})`
      );
      next();
    } catch (error) {
      console.log("❌ Token verification failed:", error.message);
      return ResponseHandler.error(
        res,
        "Not authorized, token invalid or expired",
        401
      );
    }
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    return ResponseHandler.error(res, "Authentication error", 500);
  }
};

const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ");
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
      } catch (error) {
        console.log("Token verification failed but continuing:", error.message);
      }
    }

    next();
  } catch (error) {
    console.error("isAuthenticated middleware error:", error);
    next();
  }
};

module.exports = { protect, isAuthenticated };
