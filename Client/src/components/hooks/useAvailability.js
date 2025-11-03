import { useDispatch, useSelector } from "react-redux";
import {
  getDoctorAvailability,
  getAvailableDoctors,
  generateAvailability,
  bulkGenerateAvailability,
  markSlotUnavailable,
  markSlotAvailable,
  clearError,
  clearMessage,
  setFilters,
  clearFilters,
  setSelectedDate,
  setSelectedSlot,
} from "../../redux/slices/availabilitySlice";

export const useAvailability = () => {
  const dispatch = useDispatch();
  const availability = useSelector((state) => state.availability);

  const handleGetDoctorAvailability = async (doctorId, clinicId, date) => {
    return dispatch(getDoctorAvailability({ doctorId, clinicId, date }));
  };

  const handleGetAvailableDoctors = async (
    clinicId,
    date,
    slotIndex,
    specialization = null
  ) => {
    return dispatch(
      getAvailableDoctors({ clinicId, date, slotIndex, specialization })
    );
  };

  const handleGenerateAvailability = async (doctorId, clinicId, date) => {
    return dispatch(generateAvailability({ doctorId, clinicId, date }));
  };

  const handleBulkGenerateAvailability = async (doctorId, clinicId, dates) => {
    return dispatch(bulkGenerateAvailability({ doctorId, clinicId, dates }));
  };

  const handleMarkSlotUnavailable = async (
    doctorId,
    clinicId,
    date,
    slotIndex
  ) => {
    return dispatch(
      markSlotUnavailable({ doctorId, clinicId, date, slotIndex })
    );
  };

  const handleMarkSlotAvailable = async (
    doctorId,
    clinicId,
    date,
    slotIndex
  ) => {
    return dispatch(markSlotAvailable({ doctorId, clinicId, date, slotIndex }));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleClearMessage = () => {
    dispatch(clearMessage());
  };

  const handleSetFilters = (filters) => {
    dispatch(setFilters(filters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleSetSelectedDate = (date) => {
    dispatch(setSelectedDate(date));
  };

  const handleSetSelectedSlot = (slotIndex) => {
    dispatch(setSelectedSlot(slotIndex));
  };

  return {
    // State
    ...availability,

    // Methods
    handleGetDoctorAvailability,
    handleGetAvailableDoctors,
    handleGenerateAvailability,
    handleBulkGenerateAvailability,
    handleMarkSlotUnavailable,
    handleMarkSlotAvailable,
    handleClearError,
    handleClearMessage,
    handleSetFilters,
    handleClearFilters,
    handleSetSelectedDate,
    handleSetSelectedSlot,
  };
};
