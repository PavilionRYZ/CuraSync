const { register, login } = require("../services/authService");
const User = require("../models/User");
const ResponseHandler = require("../utils/responseHandler");
const { USER_ROLES } = require("../config/constants");

exports.register = async (req, res, next) => {
  try {
    const { role } = req.body;

    // Only allow patient role in public registration
    if (role && role !== USER_ROLES.PATIENT) {
      return ResponseHandler.error(
        res,
        "Only patients can self-register. Contact admin for doctor/admin registration.",
        403
      );
    }

    // Force role to patient
    req.body.role = USER_ROLES.PATIENT;

    const result = await register(req.body);

    // Set cookie for authentication
    res.cookie("authToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    console.log("✅ Patient registered and cookie set");

    return ResponseHandler.success(
      res,
      result,
      "Patient registered successfully",
      201
    );
  } catch (error) {
    console.error("❌ Registration error:", error);
    next(error);
  }
};

exports.createAdmin = async (req, res, next) => {
  try {
    // Verify admin authorization
    if (!req.user || req.user.role !== USER_ROLES.ADMIN) {
      return ResponseHandler.error(
        res,
        "Unauthorized. Only admins can create users.",
        403
      );
    }

    const { role } = req.body;

    // Only allow admin and doctor roles
    if (role !== USER_ROLES.DOCTOR && role !== USER_ROLES.ADMIN) {
      return ResponseHandler.error(
        res,
        "Invalid role. Admins can only create doctor or admin accounts.",
        400
      );
    }

    const result = await register(req.body);

    console.log(`✅ ${role} created by admin: ${req.user.email}`);

    return ResponseHandler.success(
      res,
      result,
      `${
        role.charAt(0).toUpperCase() + role.slice(1)
      } account created successfully`,
      201
    );
  } catch (error) {
    console.error("❌ User creation error:", error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ResponseHandler.error(
        res,
        "Please provide email and password",
        400
      );
    }

    const result = await login(email, password);

    // Set cookie for authentication
    res.cookie("authToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    console.log(
      `✅ User logged in: ${result.user.email} (${result.user.role})`
    );

    return ResponseHandler.success(res, result, "Login successful");
  } catch (error) {
    console.error("❌ Login error:", error);
    return ResponseHandler.error(res, error.message, 401);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return ResponseHandler.error(res, "User not found", 404);
    }

    return ResponseHandler.success(res, user, "Profile fetched successfully");
  } catch (error) {
    console.error("❌ Get profile error:", error);
    return ResponseHandler.error(res, error.message, 500);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = [
      "name",
      "phone",
      "dateOfBirth",
      "address",
      "profilePicture",
    ];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return ResponseHandler.error(res, "User not found", 404);
    }

    return ResponseHandler.success(res, user, "Profile updated successfully");
  } catch (error) {
    console.error("❌ Update profile error:", error);
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return ResponseHandler.error(
        res,
        "Please provide current and new password",
        400
      );
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return ResponseHandler.error(res, "User not found", 404);
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return ResponseHandler.error(res, "Current password is incorrect", 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    console.log(`✅ Password changed for user: ${user.email}`);

    return ResponseHandler.success(res, null, "Password changed successfully");
  } catch (error) {
    console.error("❌ Change password error:", error);
    next(error);
  }
};

exports.logout = async (req, res) => {
  try {
    if (!req.user) {
      return ResponseHandler.error(res, "User not authenticated", 401);
    }

    const tEmail = req.user.email;

    res.clearCookie("authToken", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", 
    });

    console.log(`✅ User logged out: ${tEmail}`);
    return ResponseHandler.success(res, null, "Logout successful");
  } catch (error) {
    console.error("❌ Logout error:", error);
    return ResponseHandler.error(res, error.message, 500);
  }
};
