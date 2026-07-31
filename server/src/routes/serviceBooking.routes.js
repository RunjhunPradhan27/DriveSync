const express = require('express');
const {
  createServiceBooking,
  getAllServiceBookings,
  getServiceBookingById,
  updateServiceBooking,
  deleteServiceBooking
} = require('../controllers/serviceBooking.controller');
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

/**
 * @route   GET /:id
 * @desc    Retrieves a single service booking by booking_id
 * @access  Private (Admin, Technician, Sales Executive)
 */
router.get('/:id', authenticateUser, authorize('Admin', 'Technician', 'Sales Executive'), getServiceBookingById);

/**
 * @route   PUT /:id
 * @desc    Partially updates a service booking record
 * @access  Private (Admin, Sales Executive)
 */
router.put('/:id', authenticateUser, authorize('Admin', 'Sales Executive'), updateServiceBooking);

/**
 * @route   DELETE /:id
 * @desc    Deletes a service booking record
 * @access  Private (Admin, Sales Executive)
 */
router.delete('/:id', authenticateUser, authorize('Admin', 'Sales Executive'), deleteServiceBooking);

module.exports = router;
