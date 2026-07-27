const ServiceBooking = require('../models/serviceBooking.model');

/**
 * ServiceBooking Controller
 * Handles incoming HTTP requests, validates input, invokes model operations,
 * and formats HTTP responses for service booking resources.
 */

/**
 * Handles creation of a new service booking appointment.
 * @param {Object} req - Express request object containing booking details in body
 * @param {Object} res - Express response object
 */
const createServiceBooking = async (req, res) => {
  try {
    const {
      customer_id,
      vehicle_id,
      service_date,
      service_type,
      service_status,
      remarks
    } = req.body;

    // Validate required fields
    if (!customer_id || !vehicle_id || !service_date || !service_type) {
      return res.status(400).json({
        status: 'error',
        message: 'customer_id, vehicle_id, service_date, and service_type are required fields.'
      });
    }

    // Call Model to perform database insertion
    const result = await ServiceBooking.create({
      customer_id,
      vehicle_id,
      service_date,
      service_type,
      service_status,
      remarks
    });

    // Send HTTP 201 Created response
    return res.status(201).json({
      status: 'success',
      message: 'Service booking created successfully',
      data: {
        booking_id: result.insertId,
        customer_id,
        vehicle_id,
        service_date,
        service_type,
        service_status: service_status || 'Pending',
        remarks: remarks || null
      }
    });
  } catch (error) {
    console.error('Error in createServiceBooking controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating service booking',
      error: error.message
    });
  }
};

/**
 * Handles fetching all service bookings.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllServiceBookings = async (req, res) => {
  try {
    // Call Model to fetch all booking records from database
    const bookings = await ServiceBooking.findAll();

    // Send HTTP 200 OK response
    return res.status(200).json({
      status: 'success',
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error in getAllServiceBookings controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching service bookings',
      error: error.message
    });
  }
};

module.exports = {
  createServiceBooking,
  getAllServiceBookings
};
