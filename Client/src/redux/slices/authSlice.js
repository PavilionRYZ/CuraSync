import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`;

axios.defaults.withCredentials = true;

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
  message: null,
  registrationEmail: null,
  resetEmail: null,
};

// ✅ 1. Signup: Initiates user Signup and sends OTP
export const signup = createAsyncThunk(
  "auth/signup",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

// ✅ 2. Verify OTP: Completes signup by verifying OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, {
        email,
        otp,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// ✅ 3. Resend OTP
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/resend-otp`, { email });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend OTP"
      );
    }
  }
);

// ✅ 4. Check Registration Status
export const checkRegistrationStatus = createAsyncThunk(
  "auth/checkRegistrationStatus",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/registration-status`, {
        params: { email },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check status"
      );
    }
  }
);

// ✅ 5. Login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// ✅ 6. Get Current User Profile
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/profile`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// ✅ 7. Update User Profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/profile/update`,
        profileData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// ✅ 8. Change Password
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/change-password`, {
        currentPassword,
        newPassword,
      });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
);

// ✅ 9. Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset email"
      );
    }
  }
);

// ✅ 10. Verify Reset OTP
export const verifyResetOtp = createAsyncThunk(
  "auth/verifyResetOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/verify-reset-otp`, {
        email,
        otp,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid reset OTP"
      );
    }
  }
);

// ✅ 11. Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, resetToken, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, {
        email,
        resetToken,
        newPassword,
      });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

// ✅ 12. Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/logout`);
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Clear errors
    clearError: (state) => {
      state.error = null;
    },
    // ✅ Clear message
    clearMessage: (state) => {
      state.message = null;
    },
    // ✅ Clear all auth state
    clearAuthState: (state) => {
      state.error = null;
      state.message = null;
      state.isLoading = false;
    },
    // ✅ Set registration email
    setRegistrationEmail: (state, action) => {
      state.registrationEmail = action.payload;
    },
    // ✅ Set reset email
    setResetEmail: (state, action) => {
      state.resetEmail = action.payload;
    },
    // ✅ Logout locally (without API call)
    logoutLocal: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.message = null;
      state.registrationEmail = null;
      state.resetEmail = null;
    },
    clearRegistrationData: (state) => {
      state.registrationEmail = null;
      state.error = null;
      state.message = null;
    },

    resetAuthState: (state) => {
      state.error = null;
      state.message = null;
      state.registrationEmail = null;
      state.resetEmail = null;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.registrationEmail = action.payload.data.email;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = "Email verified successfully!";
        state.registrationEmail = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Resend OTP
    builder
      .addCase(resendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Check Registration Status
    builder
      .addCase(checkRegistrationStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkRegistrationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(checkRegistrationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = "Login successful!";
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update User Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.message = "Profile updated successfully!";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Verify Reset OTP
    builder
      .addCase(verifyResetOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyResetOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resetEmail = action.payload.email;
        state.message = "OTP verified! Now set your new password.";
      })
      .addCase(verifyResetOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.resetEmail = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
        state.message = "Logged out successfully!";
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Still logout locally even if API fails
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const {
  clearError,
  clearMessage,
  clearAuthState,
  setRegistrationEmail,
  setResetEmail,
  logoutLocal,
  clearRegistrationData,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
