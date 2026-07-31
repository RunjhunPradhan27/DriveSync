const express = require('express');
const { createServiceBooking, getAllServiceBookings } = require('../controllers/serviceBooking.controller');
const { authenticateUser } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorize.middleware');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new service booking appointment
 * @access  Private (Admin, Sales Executive)
 */
router.post('/', authenticateUser, authorize('Admin', 'Sales Executive'), createServiceBooking);

/**
 * @route   GET /
 * @desc    Retrieves all service booking records
 * @access  Private (Admin, Technician, Sales Executive)
 */
router.get('/', authenticateUser, authorize('Admin', 'Technician', 'Sales Executive'), getAllServiceBookings);

module.exports = router;
