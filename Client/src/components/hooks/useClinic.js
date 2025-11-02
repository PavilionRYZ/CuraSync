import { useDispatch, useSelector } from "react-redux";
import {
  getAllClinics,
  getClinicById,
  getNearbyClinic,
  createClinic,
  updateClinic,
  deleteClinic,
  clearError,
  clearMessage,
  setFilters,
  clearFilters,
  setPage,
  setUserLocation,
  clearUserLocation,
} from "../../redux/slices/clinicSlice";

export const useClinic = () => {
  const dispatch = useDispatch();
  const clinic = useSelector((state) => state.clinic);

  const handleGetAllClinics = async (filters = {}) => {
    return dispatch(getAllClinics(filters));
  };

  const handleGetClinicById = async (clinicId) => {
    return dispatch(getClinicById(clinicId));
  };

  const handleGetNearbyClinic = async (
    latitude,
    longitude,
    maxDistance = 10000
  ) => {
    return dispatch(getNearbyClinic({ latitude, longitude, maxDistance }));
  };

  const handleCreateClinic = async (clinicData) => {
    return dispatch(createClinic(clinicData));
  };

  const handleUpdateClinic = async (clinicId, data) => {
    return dispatch(updateClinic({ clinicId, data }));
  };

  const handleDeleteClinic = async (clinicId) => {
    return dispatch(deleteClinic(clinicId));
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

  const handleSetPage = (page) => {
    dispatch(setPage(page));
  };

  const handleSetUserLocation = (latitude, longitude) => {
    dispatch(setUserLocation({ latitude, longitude }));
  };

  const handleClearUserLocation = () => {
    dispatch(clearUserLocation());
  };

  return {
    // State
    ...clinic,

    // Methods
    handleGetAllClinics,
    handleGetClinicById,
    handleGetNearbyClinic,
    handleCreateClinic,
    handleUpdateClinic,
    handleDeleteClinic,
    handleClearError,
    handleClearMessage,
    handleSetFilters,
    handleClearFilters,
    handleSetPage,
    handleSetUserLocation,
    handleClearUserLocation,
  };
};
