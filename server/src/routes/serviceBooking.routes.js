const express = require('express');
const { createServiceBooking, getAllServiceBookings } = require('../controllers/serviceBooking.controller');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new service booking appointment
 * @access  Public
 */
router.post('/', createServiceBooking);

/**
 * @route   GET /
 * @desc    Retrieves all service booking records
 * @access  Public
 */
router.get('/', getAllServiceBookings);

module.exports = router;
