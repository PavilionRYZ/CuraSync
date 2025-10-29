const { SLOT_DURATION } = require("../config/constants");

/**
 * Convert time string (HH:MM) to minutes from midnight
 */
const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes from midnight to time string (HH:MM)
 */
const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

/**
 * Generate slot index from time
 */
const getSlotIndex = (timeString) => {
  const minutes = timeToMinutes(timeString);
  return Math.floor(minutes / SLOT_DURATION);
};

/**
 * Generate time slots for a given time range
 */
const generateTimeSlots = (startTime, endTime) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const slots = [];

  for (
    let minutes = startMinutes;
    minutes < endMinutes;
    minutes += SLOT_DURATION
  ) {
    const slotIndex = Math.floor(minutes / SLOT_DURATION);
    const slotStart = minutesToTime(minutes);
    const slotEnd = minutesToTime(minutes + SLOT_DURATION);

    slots.push({
      slotIndex,
      startTime: slotStart,
      endTime: slotEnd,
      isAvailable: true,
      capacity: 1,
    });
  }

  return slots;
};

/**
 * Format date to YYYY-MM-DD
 */
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Get day of week from date string (YYYY-MM-DD)
 */
const getDayOfWeek = (dateString) => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const date = new Date(dateString);
  return days[date.getDay()];
};

module.exports = {
  timeToMinutes,
  minutesToTime,
  getSlotIndex,
  generateTimeSlots,
  formatDate,
  getDayOfWeek,
};
