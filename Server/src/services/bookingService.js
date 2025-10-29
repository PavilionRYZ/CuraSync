const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const DoctorClinicAffiliation = require('../models/DoctorClinicAffiliation');
const { getAvailableSlots, findFreeDoctors } = require('./availabilityService');
const { APPOINTMENT_STATUS, AFFILIATION_STATUS } = require('../config/constants');

/**
 * Book appointment with auto-allocated doctor
 */
const bookAppointmentAuto = async (patientId, clinicId, date, slotIndex, preferences = {}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find free doctors
    const freeDoctors = await findFreeDoctors(
      clinicId,
      date,
      slotIndex,
      preferences.specialization
    );

    if (freeDoctors.length === 0) {
      throw new Error('No doctors available for this slot');
    }

    // Select the first free doctor (already sorted by rating)
    const selectedDoctor = freeDoctors[0];

    // Create appointment
    const appointment = await Appointment.create([{
      patientId,
      doctorId: selectedDoctor.doctorId,
      clinicId,
      date,
      slotIndex,
      startTime: selectedDoctor.slotDetails.startTime,
      endTime: selectedDoctor.slotDetails.endTime,
      status: APPOINTMENT_STATUS.BOOKED,
      fee: selectedDoctor.fee,
      reasonForVisit: preferences.reasonForVisit,
      symptoms: preferences.symptoms
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return await Appointment.findById(appointment[0]._id)
      .populate('patientId', 'name email phone')
      .populate('doctorId')
      .populate('clinicId', 'name address phone');

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/**
 * Book appointment with specific doctor
 */
const bookAppointmentSpecific = async (patientId, doctorId, clinicId, date, slotIndex, details = {}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Verify affiliation
    const affiliation = await DoctorClinicAffiliation.findOne({
      doctorId,
      clinicId,
      status: AFFILIATION_STATUS.ACTIVE
    });

    if (!affiliation) {
      throw new Error('Doctor is not affiliated with this clinic');
    }

    // Check if slot is available
    const availableSlots = await getAvailableSlots(doctorId, clinicId, date);
    const requestedSlot = availableSlots.find(slot => slot.slotIndex === slotIndex);

    if (!requestedSlot) {
      throw new Error('This slot is not available');
    }

    // Create appointment
    const appointment = await Appointment.create([{
      patientId,
      doctorId,
      clinicId,
      date,
      slotIndex,
      startTime: requestedSlot.startTime,
      endTime: requestedSlot.endTime,
      status: APPOINTMENT_STATUS.BOOKED,
      fee: affiliation.consultationFee,
      reasonForVisit: details.reasonForVisit,
      symptoms: details.symptoms
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return await Appointment.findById(appointment[0]._id)
      .populate('patientId', 'name email phone')
      .populate('doctorId')
      .populate('clinicId', 'name address phone');

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    // Handle duplicate booking error
    if (error.code === 11000) {
      throw new Error('This slot is already booked');
    }
    throw error;
  }
};

/**
 * Cancel appointment
 */
const cancelAppointment = async (appointmentId, userId, userRole, cancelReason = '') => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  // Check authorization
  if (userRole !== 'admin' && appointment.patientId.toString() !== userId) {
    throw new Error('Not authorized to cancel this appointment');
  }

  if (appointment.status !== APPOINTMENT_STATUS.BOOKED) {
    throw new Error('Only booked appointments can be canceled');
  }

  appointment.status = APPOINTMENT_STATUS.CANCELED;
  appointment.canceledAt = new Date();
  appointment.cancelReason = cancelReason;
  await appointment.save();

  return appointment;
};

/**
 * Get patient appointments
 */
const getPatientAppointments = async (patientId, filters = {}) => {
  const query = { patientId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.fromDate && filters.toDate) {
    query.date = { $gte: filters.fromDate, $lte: filters.toDate };
  } else if (filters.date) {
    query.date = filters.date;
  }

  const appointments = await Appointment.find(query)
    .populate('doctorId')
    .populate('clinicId', 'name address phone')
    .sort({ date: 1, slotIndex: 1 });

  return appointments;
};

/**
 * Get doctor appointments
 */
const getDoctorAppointments = async (doctorId, filters = {}) => {
  const query = { doctorId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.date) {
    query.date = filters.date;
  }

  if (filters.fromDate && filters.toDate) {
    query.date = { $gte: filters.fromDate, $lte: filters.toDate };
  }

  const appointments = await Appointment.find(query)
    .populate('patientId', 'name email phone dateOfBirth')
    .populate('clinicId', 'name address phone')
    .sort({ date: 1, slotIndex: 1 });

  return appointments;
};

/**
 * Get clinic appointments
 */
const getClinicAppointments = async (clinicId, filters = {}) => {
  const query = { clinicId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.date) {
    query.date = filters.date;
  }

  if (filters.fromDate && filters.toDate) {
    query.date = { $gte: filters.fromDate, $lte: filters.toDate };
  }

  const appointments = await Appointment.find(query)
    .populate('patientId', 'name email phone')
    .populate('doctorId')
    .sort({ date: 1, slotIndex: 1 });

  return appointments;
};

/**
 * Update appointment status
 */
const updateAppointmentStatus = async (appointmentId, status, notes = '') => {
  const validStatuses = Object.values(APPOINTMENT_STATUS);
  
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  appointment.status = status;
  appointment.notes = notes;

  if (status === APPOINTMENT_STATUS.COMPLETED) {
    appointment.completedAt = new Date();
  }

  await appointment.save();

  return appointment;
};

/**
 * Reschedule appointment
 */
const rescheduleAppointment = async (appointmentId, newDate, newSlotIndex) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  if (appointment.status !== APPOINTMENT_STATUS.BOOKED) {
    throw new Error('Only booked appointments can be rescheduled');
  }

  // Check if new slot is available
  const availableSlots = await getAvailableSlots(
    appointment.doctorId,
    appointment.clinicId,
    newDate
  );

  const newSlot = availableSlots.find(slot => slot.slotIndex === newSlotIndex);

  if (!newSlot) {
    throw new Error('New slot is not available');
  }

  // Update appointment
  appointment.date = newDate;
  appointment.slotIndex = newSlotIndex;
  appointment.startTime = newSlot.startTime;
  appointment.endTime = newSlot.endTime;

  await appointment.save();

  return appointment;
};

/**
 * Get appointment by ID
 */
const getAppointmentById = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate('patientId', 'name email phone dateOfBirth')
    .populate('doctorId')
    .populate('clinicId', 'name address phone');

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  return appointment;
};

/**
 * Check if patient has existing appointment with same doctor on same date
 */
const checkDuplicateAppointment = async (patientId, doctorId, date) => {
  const existingAppointment = await Appointment.findOne({
    patientId,
    doctorId,
    date,
    status: APPOINTMENT_STATUS.BOOKED
  });

  return !!existingAppointment;
};

module.exports = {
  bookAppointmentAuto,
  bookAppointmentSpecific,
  cancelAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getClinicAppointments,
  updateAppointmentStatus,
  rescheduleAppointment,
  getAppointmentById,
  checkDuplicateAppointment
};
