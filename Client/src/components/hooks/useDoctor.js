import { useDispatch, useSelector } from "react-redux";
import {
  getAllDoctors,
  getDoctorById,
  getMyProfile,
  registerDoctor,
  updateDoctorProfile,
  updateDoctorImage,
  getClinicDoctors,
  createAffiliation,
  updateAffiliation,
  deleteAffiliation,
  deactivateDoctor,
  clearError,
  clearMessage,
  setFilters,
  clearFilters,
  setPage,
} from "../../redux/slices/doctroSlice";

export const useDoctor = () => {
  const dispatch = useDispatch();
  const doctor = useSelector((state) => state.doctor);

  const handleGetAllDoctors = async (filters = {}) => {
    return dispatch(getAllDoctors(filters));
  };

  const handleGetDoctorById = async (doctorId) => {
    return dispatch(getDoctorById(doctorId));
  };

  const handleGetMyProfile = async () => {
    return dispatch(getMyProfile());
  };

  const handleRegisterDoctor = async (formData) => {
    return dispatch(registerDoctor(formData));
  };

  const handleUpdateDoctorProfile = async (doctorId, data) => {
    return dispatch(updateDoctorProfile({ doctorId, data }));
  };

  const handleUpdateDoctorImage = async (formData) => {
    return dispatch(updateDoctorImage(formData));
  };

  const handleGetClinicDoctors = async (clinicId, specialization = null) => {
    return dispatch(getClinicDoctors({ clinicId, specialization }));
  };

  const handleCreateAffiliation = async (affiliationData) => {
    return dispatch(createAffiliation(affiliationData));
  };

  const handleUpdateAffiliation = async (affiliationId, data) => {
    return dispatch(updateAffiliation({ affiliationId, data }));
  };

  const handleDeleteAffiliation = async (affiliationId) => {
    return dispatch(deleteAffiliation(affiliationId));
  };

  const handleDeactivateDoctor = async (doctorId, reason = "") => {
    return dispatch(deactivateDoctor({ doctorId, reason }));
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

  return {
    // State
    ...doctor,

    // Methods
    handleGetAllDoctors,
    handleGetDoctorById,
    handleGetMyProfile,
    handleRegisterDoctor,
    handleUpdateDoctorProfile,
    handleUpdateDoctorImage,
    handleGetClinicDoctors,
    handleCreateAffiliation,
    handleUpdateAffiliation,
    handleDeleteAffiliation,
    handleDeactivateDoctor,
    handleClearError,
    handleClearMessage,
    handleSetFilters,
    handleClearFilters,
    handleSetPage,
  };
};
