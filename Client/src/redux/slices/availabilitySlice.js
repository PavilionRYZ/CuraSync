import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/availability`;

axios.defaults.withCredentials = true;

const initialState = {
  // Doctor Availability
  doctorAvailability: {
    slots: [],
    date: null,
    doctorId: null,
    clinicId: null,
  },

  // Available Doctors for Slot
  availableDoctors: [],

  // All Availabilities
  availabilities: [],
  selectedAvailability: null,

  // Loading states
  isLoading: false,
  slotsLoading: false,
  doctorsLoading: false,
  generateLoading: false,

  // Error states
  error: null,
  message: null,

  // Filters
  filters: {
    date: null,
    specialization: null,
    slotIndex: null,
  },
};

// ✅ 1. Get Doctor Availability (Available Slots)
export const getDoctorAvailability = createAsyncThunk(
  "availability/getDoctorAvailability",
  async ({ doctorId, clinicId, date }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("doctorId", doctorId);
      params.append("clinicId", clinicId);
      params.append("date", date);

      const response = await axios.get(`${API_URL}/doctor?${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch availability"
      );
    }
  }
);

// ✅ 2. Get Available Doctors for Slot
export const getAvailableDoctors = createAsyncThunk(
  "availability/getAvailableDoctors",
  async (
    { clinicId, date, slotIndex, specialization },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("clinicId", clinicId);
      params.append("date", date);
      params.append("slotIndex", slotIndex);
      if (specialization) params.append("specialization", specialization);

      const response = await axios.get(`${API_URL}/doctors?${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch available doctors"
      );
    }
  }
);

// ✅ 3. Generate Availability
export const generateAvailability = createAsyncThunk(
  "availability/generateAvailability",
  async ({ doctorId, clinicId, date }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/generate`, {
        doctorId,
        clinicId,
        date,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate availability"
      );
    }
  }
);

// ✅ 4. Bulk Generate Availability
export const bulkGenerateAvailability = createAsyncThunk(
  "availability/bulkGenerateAvailability",
  async ({ doctorId, clinicId, dates }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/bulk-generate`, {
        doctorId,
        clinicId,
        dates,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to generate availability for multiple dates"
      );
    }
  }
);

// ✅ 5. Mark Slot Unavailable
export const markSlotUnavailable = createAsyncThunk(
  "availability/markSlotUnavailable",
  async ({ doctorId, clinicId, date, slotIndex }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/mark-unavailable`, {
        doctorId,
        clinicId,
        date,
        slotIndex,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark slot unavailable"
      );
    }
  }
);

// ✅ 6. Mark Slot Available
export const markSlotAvailable = createAsyncThunk(
  "availability/markSlotAvailable",
  async ({ doctorId, clinicId, date, slotIndex }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/mark-available`, {
        doctorId,
        clinicId,
        date,
        slotIndex,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark slot available"
      );
    }
  }
);

const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {
    // ✅ Clear error
    clearError: (state) => {
      state.error = null;
    },

    // ✅ Clear message
    clearMessage: (state) => {
      state.message = null;
    },

    // ✅ Clear all state
    clearAvailabilityState: (state) => {
      state.error = null;
      state.message = null;
      state.doctorAvailability = initialState.doctorAvailability;
      state.availableDoctors = [];
    },

    // ✅ Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // ✅ Clear filters
    clearFilters: (state) => {
      state.filters = {
        date: null,
        specialization: null,
        slotIndex: null,
      };
    },

    // ✅ Set selected date
    setSelectedDate: (state, action) => {
      state.filters.date = action.payload;
    },

    // ✅ Set selected slot
    setSelectedSlot: (state, action) => {
      state.filters.slotIndex = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Get Doctor Availability
    builder
      .addCase(getDoctorAvailability.pending, (state) => {
        state.slotsLoading = true;
        state.error = null;
      })
      .addCase(getDoctorAvailability.fulfilled, (state, action) => {
        state.slotsLoading = false;
        state.doctorAvailability = {
          slots: action.payload.slots,
          date: action.payload.date,
          doctorId: action.payload.doctorId,
          clinicId: action.payload.clinicId,
        };
      })
      .addCase(getDoctorAvailability.rejected, (state, action) => {
        state.slotsLoading = false;
        state.error = action.payload;
        state.doctorAvailability.slots = [];
      });

    // Get Available Doctors
    builder
      .addCase(getAvailableDoctors.pending, (state) => {
        state.doctorsLoading = true;
        state.error = null;
      })
      .addCase(getAvailableDoctors.fulfilled, (state, action) => {
        state.doctorsLoading = false;
        state.availableDoctors = action.payload.doctors || [];
      })
      .addCase(getAvailableDoctors.rejected, (state, action) => {
        state.doctorsLoading = false;
        state.error = action.payload;
        state.availableDoctors = [];
      });

    // Generate Availability
    builder
      .addCase(generateAvailability.pending, (state) => {
        state.generateLoading = true;
        state.error = null;
      })
      .addCase(generateAvailability.fulfilled, (state, action) => {
        state.generateLoading = false;
        state.message = "Availability generated successfully";
        state.selectedAvailability = action.payload;
      })
      .addCase(generateAvailability.rejected, (state, action) => {
        state.generateLoading = false;
        state.error = action.payload;
      });

    // Bulk Generate Availability
    builder
      .addCase(bulkGenerateAvailability.pending, (state) => {
        state.generateLoading = true;
        state.error = null;
      })
      .addCase(bulkGenerateAvailability.fulfilled, (state, action) => {
        state.generateLoading = false;
        state.message = "Availability generated for multiple dates";
        state.availabilities = action.payload.results || [];
      })
      .addCase(bulkGenerateAvailability.rejected, (state, action) => {
        state.generateLoading = false;
        state.error = action.payload;
      });

    // Mark Slot Unavailable
    builder
      .addCase(markSlotUnavailable.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markSlotUnavailable.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = "Slot marked as unavailable";
        state.selectedAvailability = action.payload;
      })
      .addCase(markSlotUnavailable.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Mark Slot Available
    builder
      .addCase(markSlotAvailable.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markSlotAvailable.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = "Slot marked as available";
        state.selectedAvailability = action.payload;
      })
      .addCase(markSlotAvailable.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearMessage,
  clearAvailabilityState,
  setFilters,
  clearFilters,
  setSelectedDate,
  setSelectedSlot,
} = availabilitySlice.actions;

export default availabilitySlice.reducer;
