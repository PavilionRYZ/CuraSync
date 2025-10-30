const User = require("../models/User");
const TempUser = require("../models/tempUser");
const ResponseHandler = require("../utils/responseHandler");
const { USER_ROLES } = require("../config/constants");
const { generateOTP } = require("../utils/generateOTP");
const { sendOTPEmail } = require("../utils/sendEmail");
const OTP = require("../models/OTP");

// Register - Store in TempUser and send OTP
exports.register = async (req, res, next) => {
  try {
    const { role, email } = req.body;

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

    // Check if user already exists in User collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ResponseHandler.error(
        res,
        "Email already registered. Please login.",
        409
      );
    }

    // Check if email is already in TempUser (pending verification)
    const existingTempUser = await TempUser.findOne({ email });
    if (existingTempUser) {
      // Delete existing temp user to allow re-registration
      await TempUser.deleteOne({ email });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create temporary user with OTP
    const tempUser = await TempUser.create({
      ...req.body,
      otp,
      otpExpiry,
    });

    // Send OTP email
    await sendOTPEmail(email, otp, "registration");

    console.log(`✅ Registration initiated for: ${email}. OTP sent.`);

    return ResponseHandler.success(
      res,
      {
        email,
        message:
          "Registration initiated! Please check your email for OTP verification.",
        expiresIn: "10 minutes",
      },
      "OTP sent to your email. Please verify to complete registration.",
      201
    );
  } catch (error) {
    console.error("❌ Registration error:", error);
    next(error);
  }
};

// Verify OTP - Create actual user and delete TempUser
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return ResponseHandler.error(res, "Email and OTP are required", 400);
    }

    // Find temporary user
    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return ResponseHandler.error(
        res,
        "Registration session expired or not found. Please register again.",
        400
      );
    }

    // Check OTP expiry
    if (new Date() > tempUser.otpExpiry) {
      await TempUser.deleteOne({ email });
      return ResponseHandler.error(
        res,
        "OTP has expired. Please register again.",
        400
      );
    }

    // Check attempts
    if (tempUser.attempts >= 5) {
      await TempUser.deleteOne({ email });
      return ResponseHandler.error(
        res,
        "Too many failed attempts. Please register again.",
        400
      );
    }

    // Verify OTP
    if (tempUser.otp !== otp) {
      tempUser.attempts += 1;
      await tempUser.save();
      return ResponseHandler.error(
        res,
        `Invalid OTP. ${5 - tempUser.attempts} attempts remaining.`,
        400
      );
    }

    // ✅ OTP is correct - Create actual user
    const userData = {
      name: tempUser.name,
      email: tempUser.email,
      phone: tempUser.phone,
      password: tempUser.password, // Already hashed in TempUser
      role: tempUser.role,
      dateOfBirth: tempUser.dateOfBirth,
      gender: tempUser.gender,
      bloodGroup: tempUser.bloodGroup,
      address: tempUser.address,
      isVerified: true, // Mark as verified
    };

    const user = await User.create(userData);

    // Delete temporary user
    await TempUser.deleteOne({ email });

    // Generate JWT token
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Set cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    console.log(`✅ Email verified and user created: ${email}`);

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
        token,
      },
      "Email verified successfully! Your account has been created."
    );
  } catch (error) {
    console.error("❌ OTP verification error:", error);

    // Handle duplicate key error (in case user was created between checks)
    if (error.code === 11000) {
      // Delete temp user
      await TempUser.deleteOne({ email: req.body.email });
      return ResponseHandler.error(
        res,
        "Email already registered. Please login.",
        409
      );
    }

    next(error);
  }
};

// Resend OTP for registration
exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return ResponseHandler.error(res, "Email is required", 400);
    }

    // Find temporary user
    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return ResponseHandler.error(
        res,
        "Registration session not found. Please register again.",
        404
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update temp user with new OTP
    tempUser.otp = otp;
    tempUser.otpExpiry = otpExpiry;
    tempUser.attempts = 0; // Reset attempts
    await tempUser.save();

    // Send OTP email
    await sendOTPEmail(email, otp, "registration");

    console.log(`✅ OTP resent to: ${email}`);

    return ResponseHandler.success(
      res,
      {
        email,
        expiresIn: "10 minutes",
      },
      "New OTP has been sent to your email."
    );
  } catch (error) {
    console.error("❌ Resend OTP error:", error);
    next(error);
  }
};

// Check registration status
exports.checkRegistrationStatus = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return ResponseHandler.error(res, "Email is required", 400);
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (user) {
      return ResponseHandler.success(
        res,
        {
          status: "completed",
          isVerified: true,
          message: "User already registered. Please login.",
        },
        "User exists"
      );
    }

    // Check if pending verification
    const tempUser = await TempUser.findOne({ email });
    if (tempUser) {
      const isExpired = new Date() > tempUser.otpExpiry;
      return ResponseHandler.success(
        res,
        {
          status: "pending",
          isVerified: false,
          isExpired,
          message: isExpired
            ? "OTP expired. Please request a new one."
            : "Registration pending. Please verify OTP.",
        },
        "Registration pending"
      );
    }

    return ResponseHandler.success(
      res,
      {
        status: "not_found",
        message: "No registration found. Please register.",
      },
      "Not registered"
    );
  } catch (error) {
    console.error("❌ Check registration status error:", error);
    next(error);
  }
};

// Keep existing methods (createAdmin, login, getProfile, etc.)
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

    const { role, email } = req.body;

    // Only allow admin and doctor roles
    if (role !== USER_ROLES.DOCTOR && role !== USER_ROLES.ADMIN) {
      return ResponseHandler.error(
        res,
        "Invalid role. Admins can only create doctor or admin accounts.",
        400
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ResponseHandler.error(res, "Email already registered", 409);
    }

    // Create user directly (no OTP verification needed for admin-created accounts)
    const user = await User.create({
      ...req.body,
      isVerified: true, // Admin-created accounts are pre-verified
    });

    console.log(`✅ ${role} created by admin: ${req.user.email}`);

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
      },
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

// ✅ Login - No changes needed, already checks isVerified
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

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return ResponseHandler.error(res, "Invalid email or password", 401);
    }

    // Check if email is verified
    if (!user.isVerified) {
      return ResponseHandler.error(
        res,
        "Please verify your email before logging in.",
        401
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return ResponseHandler.error(
        res,
        "Your account is inactive. Please contact support.",
        401
      );
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return ResponseHandler.error(res, "Invalid email or password", 401);
    }

    // Generate token
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Set cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    console.log(`✅ User logged in: ${user.email} (${user.role})`);

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
        token,
      },
      "Login successful"
    );
  } catch (error) {
    console.error("❌ Login error:", error);
    return ResponseHandler.error(res, error.message, 401);
  }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return ResponseHandler.error(res, "Email is required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return ResponseHandler.error(
        res,
        "No account found with this email",
        404
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Delete old OTPs
    await OTP.deleteMany({ email, otpType: "forgot-password" });

    // Save new OTP
    await OTP.create({
      email,
      otp,
      otpType: "forgot-password",
      expiresAt: otpExpiry,
    });

    // Send OTP email
    await sendOTPEmail(email, otp, "forgot-password");

    console.log(`✅ Password reset OTP sent to: ${email}`);

    return ResponseHandler.success(
      res,
      { email },
      "Password reset OTP has been sent to your email."
    );
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    next(error);
  }
};

exports.verifyResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return ResponseHandler.error(res, "Email and OTP are required", 400);
    }

    const otpRecord = await OTP.findOne({
      email,
      otpType: "forgot-password",
      isVerified: false,
    });

    if (!otpRecord) {
      return ResponseHandler.error(res, "OTP not found or already used", 400);
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return ResponseHandler.error(res, "OTP has expired", 400);
    }

    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return ResponseHandler.error(res, "Too many failed attempts", 400);
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return ResponseHandler.error(
        res,
        `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`,
        400
      );
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

    console.log(`✅ Reset OTP verified for: ${email}`);

    return ResponseHandler.success(
      res,
      {
        resetToken: otpRecord._id,
        email,
      },
      "OTP verified. You can now reset your password."
    );
  } catch (error) {
    console.error("❌ Verify reset OTP error:", error);
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return ResponseHandler.error(
        res,
        "Email, reset token, and new password are required",
        400
      );
    }

    if (newPassword.length < 6) {
      return ResponseHandler.error(
        res,
        "Password must be at least 6 characters",
        400
      );
    }

    const otpRecord = await OTP.findOne({
      _id: resetToken,
      email,
      otpType: "forgot-password",
      isVerified: true,
    });

    if (!otpRecord) {
      return ResponseHandler.error(res, "Invalid or expired reset token", 400);
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return ResponseHandler.error(res, "Reset token has expired", 400);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return ResponseHandler.error(res, "User not found", 404);
    }

    user.password = newPassword;
    await user.save();

    await OTP.deleteOne({ _id: otpRecord._id });

    console.log(`✅ Password reset successful for: ${email}`);

    return ResponseHandler.success(
      res,
      null,
      "Password has been reset successfully. You can now login."
    );
  } catch (error) {
    console.error("❌ Reset password error:", error);
    next(error);
  }
};

exports.resendResetOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return ResponseHandler.error(res, "Email is required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return ResponseHandler.error(res, "User not found", 404);
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.deleteMany({ email, otpType: "forgot-password" });

    await OTP.create({
      email,
      otp,
      otpType: "forgot-password",
      expiresAt: otpExpiry,
    });

    await sendOTPEmail(email, otp, "forgot-password");

    console.log(`✅ Reset OTP resent to: ${email}`);

    return ResponseHandler.success(
      res,
      null,
      "New OTP has been sent to your email."
    );
  } catch (error) {
    console.error("❌ Resend reset OTP error:", error);
    next(error);
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
      "bloodGroup",
      "gender",
      "allergies",
      "emergencyContact",
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

    if (newPassword.length < 6) {
      return ResponseHandler.error(
        res,
        "New password must be at least 6 characters",
        400
      );
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return ResponseHandler.error(res, "User not found", 404);
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return ResponseHandler.error(res, "Current password is incorrect", 400);
    }

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

    const userEmail = req.user.email;

    res.clearCookie("authToken", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    console.log(`✅ User logged out: ${userEmail}`);
    return ResponseHandler.success(res, null, "Logout successful");
  } catch (error) {
    console.error("❌ Logout error:", error);
    return ResponseHandler.error(res, error.message, 500);
  }
};
