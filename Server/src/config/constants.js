module.exports = {
  // User roles
  USER_ROLES: {
    PATIENT: 'patient',
    DOCTOR: 'doctor',
    ADMIN: 'admin'
  },
  
  // Appointment statuses
  APPOINTMENT_STATUS: {
    BOOKED: 'booked',
    CANCELED: 'canceled',
    COMPLETED: 'completed',
    NO_SHOW: 'no_show'
  },
  
  // Affiliation statuses
  AFFILIATION_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
  },
  
  // Payment statuses
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    REFUNDED: 'refunded',
    FAILED: 'failed'
  },
  
  // Slot configuration
  SLOT_DURATION: parseInt(process.env.SLOT_DURATION_MINUTES) || 30,
  MAX_SLOTS_PER_DAY: (24 * 60) / (parseInt(process.env.SLOT_DURATION_MINUTES) || 30),
  
  // Days of week
  DAYS_OF_WEEK: [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ],
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // Time formats
  TIME_FORMAT: 'HH:mm',
  DATE_FORMAT: 'YYYY-MM-DD',
  
  // Booking constraints
  MAX_ADVANCE_BOOKING_DAYS: 90,
  MIN_CANCELLATION_HOURS: 2,
  
  // Specializations (example list)
  SPECIALIZATIONS: [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Pediatrician',
    'Orthopedic',
    'Gynecologist',
    'Psychiatrist',
    'ENT Specialist',
    'Neurologist',
    'Dentist'
  ]
};
