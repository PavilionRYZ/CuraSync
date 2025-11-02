import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/clinics`;

axios.defaults.withCredentials = true;

const initialState = {
  // List states
  clinics: [],
  selectedClinic: null,
  nearbyClinics: [],

  // Loading states
  isLoading: false,
  clinicLoading: false,
  nearbyLoading: false,

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
    city: null,
    state: null,
    search: null,
  },

  // Location
  userLocation: {
    latitude: null,
    longitude: null,
  },
};

// ✅ 1. Get All Clinics
export const getAllClinics = createAsyncThunk(
  "clinic/getAllClinics",
  async (
    { city, state, search, page = 1, limit = 10 },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      if (city) params.append("city", city);
      if (state) params.append("state", state);
      if (search) params.append("search", search);
      params.append("page", page);
      params.append("limit", limit);

      const response = await axios.get(`${API_URL}/get/all?${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch clinics"
      );
    }
  }
);

// ✅ 2. Get Clinic By ID
export const getClinicById = createAsyncThunk(
  "clinic/getClinicById",
  async (clinicId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${clinicId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch clinic"
      );
    }
  }
);

// ✅ 3. Get Nearby Clinics
export const getNearbyClinic = createAsyncThunk(
  "clinic/getNearbyClinic",
  async ({ latitude, longitude, maxDistance = 10000 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("latitude", latitude);
      params.append("longitude", longitude);
      params.append("maxDistance", maxDistance);

      const response = await axios.get(`${API_URL}/nearby?${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch nearby clinics"
      );
    }
  }
);

// ✅ 4. Create Clinic (Admin)
export const createClinic = createAsyncThunk(
  "clinic/createClinic",
  async (clinicData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/create/clinic`, clinicData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create clinic"
      );
    }
  }
);

// ✅ 5. Update Clinic (Admin)
export const updateClinic = createAsyncThunk(
  "clinic/updateClinic",
  async ({ clinicId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/update/${clinicId}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update clinic"
      );
    }
  }
);

// ✅ 6. Delete Clinic (Admin)
export const deleteClinic = createAsyncThunk(
  "clinic/deleteClinic",
  async (clinicId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/delete/${clinicId}`);
      return clinicId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete clinic"
      );
    }
  }
);

const clinicSlice = createSlice({
  name: "clinic",
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
    clearClinicState: (state) => {
      state.error = null;
      state.message = null;
      state.selectedClinic = null;
    },

    // ✅ Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // ✅ Clear filters
    clearFilters: (state) => {
      state.filters = {
        city: null,
        state: null,
        search: null,
      };
    },

    // ✅ Set page
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },

    // ✅ Set user location
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },

    // ✅ Clear user location
    clearUserLocation: (state) => {
      state.userLocation = {
        latitude: null,
        longitude: null,
      };
    },
  },

  extraReducers: (builder) => {
    // Get All Clinics
    builder
      .addCase(getAllClinics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllClinics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clinics = action.payload.clinics;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllClinics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Get Clinic By ID
    builder
      .addCase(getClinicById.pending, (state) => {
        state.clinicLoading = true;
        state.error = null;
      })
      .addCase(getClinicById.fulfilled, (state, action) => {
        state.clinicLoading = false;
        state.selectedClinic = action.payload;
      })
      .addCase(getClinicById.rejected, (state, action) => {
        state.clinicLoading = false;
        state.error = action.payload;
      });

    // Get Nearby Clinics
    builder
      .addCase(getNearbyClinic.pending, (state) => {
        state.nearbyLoading = true;
        state.error = null;
      })
      .addCase(getNearbyClinic.fulfilled, (state, action) => {
        state.nearbyLoading = false;
        state.nearbyClinics = action.payload;
      })
      .addCase(getNearbyClinic.rejected, (state, action) => {
        state.nearbyLoading = false;
        state.error = action.payload;
      });

    // Create Clinic
    builder
      .addCase(createClinic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createClinic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = "Clinic created successfully";
        state.clinics.push(action.payload);
      })
      .addCase(createClinic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Clinic
    builder
      .addCase(updateClinic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateClinic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = "Clinic updated successfully";
        state.selectedClinic = action.payload;

        // Update in clinics list
        const index = state.clinics.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.clinics[index] = action.payload;
        }
      })
      .addCase(updateClinic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete Clinic
    builder
      .addCase(deleteClinic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteClinic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = "Clinic deleted successfully";
        state.clinics = state.clinics.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteClinic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearMessage,
  clearClinicState,
  setFilters,
  clearFilters,
  setPage,
  setUserLocation,
  clearUserLocation,
} = clinicSlice.actions;

export default clinicSlice.reducer;
