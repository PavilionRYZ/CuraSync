const DoctorAvailability = require('../models/DoctorAvailability');
const DoctorClinicAffiliation = require('../models/DoctorClinicAffiliation');
const Appointment = require('../models/Appointment');
const { generateTimeSlots, getDayOfWeek } = require('../utils/slotHelper');
const { AFFILIATION_STATUS, APPOINTMENT_STATUS } = require('../config/constants');

/**
 * Generate availability for a doctor at a clinic for a specific date
 */
const generateAvailability = async (doctorId, clinicId, date) => {
  // Check if affiliation exists and is active
  const affiliation = await DoctorClinicAffiliation.findOne({
    doctorId,
    clinicId,
    status: AFFILIATION_STATUS.ACTIVE
  });

  if (!affiliation) {
    throw new Error('Doctor is not affiliated with this clinic');
  }

  // Check if doctor works on this day
  const dayOfWeek = getDayOfWeek(date);
  if (!affiliation.workingDays.includes(dayOfWeek)) {
    return null; // Doctor doesn't work on this day
  }

  // Generate time slots based on working hours
  const slots = generateTimeSlots(
    affiliation.workingHours.start,
    affiliation.workingHours.end
  );

  // Check if availability already exists
  let availability = await DoctorAvailability.findOne({ doctorId, clinicId, date });

  if (availability) {
    // Update existing
    availability.slots = slots;
    await availability.save();
  } else {
    // Create new
    availability = await DoctorAvailability.create({
      doctorId,
      clinicId,
      date,
      slots
    });
  }

  return availability;
};

/**
 * Get available slots for a doctor at a clinic on a date
 */
const getAvailableSlots = async (doctorId, clinicId, date) => {
  let availability = await DoctorAvailability.findOne({ doctorId, clinicId, date });

  if (!availability) {
    // Generate if doesn't exist
    availability = await generateAvailability(doctorId, clinicId, date);
  }

  if (!availability || availability.isHoliday) {
    return [];
  }

  // Get booked appointments for this doctor on this date
  const bookedAppointments = await Appointment.find({
    doctorId,
    clinicId,
    date,
    status: APPOINTMENT_STATUS.BOOKED
  }).select('slotIndex');

  const bookedSlotIndexes = new Set(bookedAppointments.map(app => app.slotIndex));

  // Filter available slots
  const availableSlots = availability.slots
    .filter(slot => slot.isAvailable && !bookedSlotIndexes.has(slot.slotIndex))
    .map(slot => ({
      slotIndex: slot.slotIndex,
      startTime: slot.startTime,
      endTime: slot.endTime
    }));

  return availableSlots;
};

/**
 * Find all free doctors at a clinic for a given date and slot
 */
const findFreeDoctors = async (clinicId, date, slotIndex, specialization = null) => {
  // Find all active affiliations for this clinic
  const query = {
    clinicId,
    status: AFFILIATION_STATUS.ACTIVE
  };

  const affiliations = await DoctorClinicAffiliation.find(query)
    .populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'name email phone' }
    });

  const freeDoctors = [];

  for (const affiliation of affiliations) {
    const doctor = affiliation.doctorId;

    // Filter by specialization if provided
    if (specialization && !doctor.specialization.includes(specialization)) {
      continue;
    }

    // Check if doctor works on this day
    const dayOfWeek = getDayOfWeek(date);
    if (!affiliation.workingDays.includes(dayOfWeek)) {
      continue;
    }

    // Check if doctor is available for this slot
    const availableSlots = await getAvailableSlots(doctor._id, clinicId, date);
    const isSlotFree = availableSlots.some(slot => slot.slotIndex === slotIndex);

    if (isSlotFree) {
      freeDoctors.push({
        doctorId: doctor._id,
        doctor: {
          name: doctor.userId.name,
          specialization: doctor.specialization,
          experience: doctor.experience,
          rating: doctor.rating
        },
        fee: affiliation.consultationFee,
        slotDetails: availableSlots.find(slot => slot.slotIndex === slotIndex)
      });
    }
  }

  // Sort by rating (preference)
  freeDoctors.sort((a, b) => b.doctor.rating - a.doctor.rating);

  return freeDoctors;
};

/**
 * Mark a slot as unavailable (for breaks, emergencies, etc.)
 */
const markSlotUnavailable = async (doctorId, clinicId, date, slotIndex) => {
  const availability = await DoctorAvailability.findOne({ doctorId, clinicId, date });

  if (!availability) {
    throw new Error('Availability not found for this date');
  }

  const slot = availability.slots.find(s => s.slotIndex === slotIndex);
  
  if (!slot) {
    throw new Error('Slot not found');
  }

  slot.isAvailable = false;
  await availability.save();

  return availability;
};

/**
 * Mark a slot as available again
 */
const markSlotAvailable = async (doctorId, clinicId, date, slotIndex) => {
  const availability = await DoctorAvailability.findOne({ doctorId, clinicId, date });

  if (!availability) {
    throw new Error('Availability not found for this date');
  }

  const slot = availability.slots.find(s => s.slotIndex === slotIndex);
  
  if (!slot) {
    throw new Error('Slot not found');
  }

  slot.isAvailable = true;
  await availability.save();

  return availability;
};

/**
 * Bulk generate availability for multiple dates
 */
const bulkGenerateAvailability = async (doctorId, clinicId, dates) => {
  const results = [];

  for (const date of dates) {
    try {
      const availability = await generateAvailability(doctorId, clinicId, date);
      results.push({ date, success: true, availability });
    } catch (error) {
      results.push({ date, success: false, error: error.message });
    }
  }

  return results;
};

module.exports = {
  generateAvailability,
  getAvailableSlots,
  findFreeDoctors,
  markSlotUnavailable,
  markSlotAvailable,
  bulkGenerateAvailability
};
