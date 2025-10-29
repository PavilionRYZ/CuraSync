const { body, param, query, validationResult } = require('express-validator');
const ResponseHandler = require('../utils/responseHandler');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseHandler.validationError(res, errors.array());
  }
  next();
};

// Validation rules
const validationRules = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['patient', 'doctor', 'admin']).withMessage('Invalid role')
  ],

  login: [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],

  createClinic: [
    body('name').trim().notEmpty().withMessage('Clinic name is required'),
    body('address.street').notEmpty().withMessage('Street is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.state').notEmpty().withMessage('State is required'),
    body('address.zipCode').notEmpty().withMessage('Zip code is required'),
    body('phone').notEmpty().withMessage('Phone is required')
  ],

  createAffiliation: [
    body('doctorId').isMongoId().withMessage('Valid doctor ID is required'),
    body('clinicId').isMongoId().withMessage('Valid clinic ID is required'),
    body('consultationFee').isNumeric().withMessage('Consultation fee must be a number'),
    body('workingDays').isArray().withMessage('Working days must be an array'),
    body('workingHours.start').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time required'),
    body('workingHours.end').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time required')
  ],

  bookAppointment: [
    body('clinicId').isMongoId().withMessage('Valid clinic ID is required'),
    body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
    body('slotIndex').isInt({ min: 0 }).withMessage('Valid slot index is required'),
    body('doctorId').optional().isMongoId().withMessage('Valid doctor ID required')
  ]
};

module.exports = { validate, validationRules };
