import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/doctors`;

axios.defaults.withCredentials = true;

const initialState = {
  // List states
  doctors: [],
  selectedDoctor: null,
  myProfile: null,

  // Loading states
  isLoading: false,
  profileLoading: false,
  imageLoading: false,
  affiliationLoading: false,

  // Error states
  error: null,
  message: null,

  // Pagination
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  },

  // Filters
  filters: {
    specialization: null,
    minExperience: null,
    minRating: null,
    isVerified: null,
  },

  // Affiliations
  affiliations: [],
  clinicDoctors: [],
};

// ✅ 1. Get All Doctors
export const getAllDoctors = createAsyncThunk(
  "doctor/getAllDoctors",
  async (
    {
      specialization,
      minExperience,
      minRating,
      isVerified,
      page = 1,
      limit = 10,
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      if (specialization) params.append("specialization", specialization);
      if (minExperience) params.append("minExperience", minExperience);
      if (minRating) params.append("minRating", minRating);
      if (isVerified !== null && isVerified !== undefined)
        params.append("isVerified", isVerified);
      params.append("page", page);
      params.append("limit", limit);

      const response = await axios.get(`${API_URL}/get/all?${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch doctors"
      );
    }
  }
);

// ✅ 2. Get Doctor By ID
export const getDoctorById = createAsyncThunk(
  "doctor/getDoctorById",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/doc/${doctorId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch doctor"
      );
    }
  }
);

// ✅ 3. Get My Doctor Profile
export const getMyProfile = createAsyncThunk(
  "doctor/getMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/doctor/me`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// ✅ 4. Register Doctor (Admin Only)
export const registerDoctor = createAsyncThunk(
  "doctor/registerDoctor",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/register/doctor`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to register doctor"
      );
    }
  }
);

// ✅ 5. Update Doctor Profile (Admin Only)
export const updateDoctorProfile = createAsyncThunk(
  "doctor/updateDoctorProfile",
  async ({ doctorId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/profile/update/${doctorId}`,
        data
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// ✅ 6. Update Doctor Profile Image
export const updateDoctorImage = createAsyncThunk(
  "doctor/updateDoctorImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/profile/image/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update image"
      );
    }
  }
);

// ✅ 7. Get Clinic Doctors
export const getClinicDoctors = createAsyncThunk(
  "doctor/getClinicDoctors",
  async ({ clinicId, specialization }, { rejectWithValue }) => {
    try {
      let url = `${API_URL}/clinics/${clinicId}/doctors`;
      if (specialization) url += `?specialization=${specialization}`;

      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch clinic doctors"
      );
    }
  }
);

// ✅ 8. Create Affiliation
export const createAffiliation = createAsyncThunk(
  "doctor/createAffiliation",
  async (affiliationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/affiliations/create`,
        affiliationData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create affiliation"
      );
    }
  }
);

// ✅ 9. Update Affiliation
export const updateAffiliation = createAsyncThunk(
  "doctor/updateAffiliation",
  async ({ affiliationId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/affiliation/update/${affiliationId}`,
        data
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update affiliation"
      );
    }
  }
);

// ✅ 10. Delete Affiliation
export const deleteAffiliation = createAsyncThunk(
  "doctor/deleteAffiliation",
  async (affiliationId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/affiliations/delete/${affiliationId}`);
      return affiliationId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete affiliation"
      );
    }
  }
);

// ✅ 11. Deactivate Doctor (Admin Only)
export const deactivateDoctor = createAsyncThunk(
  "doctor/deactivateDoctor",
  async ({ doctorId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/deactive/${doctorId}`, {
        reason,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to deactivate doctor"
      );
    }
  }
);

const doctorSlice = createSlice({
  name: "doctor",
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

    // ✅ Clear all states
    clearDoctorState: (state) => {
      state.error = null;
      state.message = null;
      state.selectedDoctor = null;
    },

    // ✅ Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // ✅ Clear filters
    clearFilters: (state) => {
      state.filters = {
        specialization: null,
        minExperience: null,
        minRating: null,
        isVerified: null,
      };
    },

    // ✅ Set page
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Get All Doctors
    builder
      .addCase(getAllDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload.doctors;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Get Doctor By ID
    builder
      .addCase(getDoctorById.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(getDoctorById.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(getDoctorById.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      });

    // Get My Profile
    builder
      .addCase(getMyProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.myProfile = action.payload;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      });

    // Register Doctor
    builder
      .addCase(registerDoctor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = "Doctor registered successfully";
        state.doctors.push(action.payload.doctor);
      })
      .addCase(registerDoctor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Doctor Profile
    builder
      .addCase(updateDoctorProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = "Profile updated successfully";
        state.selectedDoctor = action.payload;

        // Update in doctors list
        const index = state.doctors.findIndex(
          (d) => d._id === action.payload._id
        );
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Doctor Image
    builder
      .addCase(updateDoctorImage.pending, (state) => {
        state.imageLoading = true;
        state.error = null;
      })
      .addCase(updateDoctorImage.fulfilled, (state, action) => {
        state.imageLoading = false;
        state.message = "Profile image updated successfully";
        state.myProfile = action.payload;
      })
      .addCase(updateDoctorImage.rejected, (state, action) => {
        state.imageLoading = false;
        state.error = action.payload;
      });

    // Get Clinic Doctors
    builder
      .addCase(getClinicDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getClinicDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clinicDoctors = action.payload;
      })
      .addCase(getClinicDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create Affiliation
    builder
      .addCase(createAffiliation.pending, (state) => {
        state.affiliationLoading = true;
        state.error = null;
      })
      .addCase(createAffiliation.fulfilled, (state, action) => {
        state.affiliationLoading = false;
        state.message = "Affiliation created successfully";
        state.affiliations.push(action.payload);
      })
      .addCase(createAffiliation.rejected, (state, action) => {
        state.affiliationLoading = false;
        state.error = action.payload;
      });

    // Update Affiliation
    builder
      .addCase(updateAffiliation.pending, (state) => {
        state.affiliationLoading = true;
        state.error = null;
      })
      .addCase(updateAffiliation.fulfilled, (state, action) => {
        state.affiliationLoading = false;
        state.message = "Affiliation updated successfully";

        const index = state.affiliations.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.affiliations[index] = action.payload;
        }
      })
      .addCase(updateAffiliation.rejected, (state, action) => {
        state.affiliationLoading = false;
        state.error = action.payload;
      });

    // Delete Affiliation
    builder
      .addCase(deleteAffiliation.pending, (state) => {
        state.affiliationLoading = true;
        state.error = null;
      })
      .addCase(deleteAffiliation.fulfilled, (state, action) => {
        state.affiliationLoading = false;
        state.message = "Affiliation deleted successfully";
        state.affiliations = state.affiliations.filter(
          (a) => a._id !== action.payload
        );
      })
      .addCase(deleteAffiliation.rejected, (state, action) => {
        state.affiliationLoading = false;
        state.error = action.payload;
      });

    // Deactivate Doctor
    builder
      .addCase(deactivateDoctor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deactivateDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = "Doctor deactivated successfully";

        const index = state.doctors.findIndex(
          (d) => d._id === action.payload._id
        );
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
      })
      .addCase(deactivateDoctor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearMessage,
  clearDoctorState,
  setFilters,
  clearFilters,
  setPage,
} = doctorSlice.actions;

export default doctorSlice.reducer;
