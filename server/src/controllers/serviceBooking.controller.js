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

/**
 * Handles fetching a single service booking by booking_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getServiceBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await ServiceBooking.findById(id);

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Service booking not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    console.error('Error in getServiceBookingById controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching service booking',
      error: error.message
    });
  }
};

const SERVICE_BOOKING_UPDATABLE_FIELDS = [
  'customer_id', 'vehicle_id', 'service_date', 'service_type', 'service_status', 'remarks'
];

/**
 * Partially updates a service booking record. Only fields present in the
 * request body are changed.
 * @param {Object} req - Express request object containing fields to update in body
 * @param {Object} res - Express response object
 */
const updateServiceBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {};
    SERVICE_BOOKING_UPDATABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: `At least one of the following fields must be provided: ${SERVICE_BOOKING_UPDATABLE_FIELDS.join(', ')}`
      });
    }

    const result = await ServiceBooking.update(id, updates);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Service booking not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Service booking updated successfully',
      data: { booking_id: Number(id), ...updates }
    });
  } catch (error) {
    console.error('Error in updateServiceBooking controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while updating service booking',
      error: error.message
    });
  }
};

/**
 * Deletes a service booking by booking_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteServiceBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ServiceBooking.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Service booking not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Service booking deleted successfully'
    });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({
        status: 'error',
        message: 'Cannot delete this service booking because it has an existing service record.'
      });
    }
    console.error('Error in deleteServiceBooking controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting service booking',
      error: error.message
    });
  }
};

module.exports = {
  createServiceBooking,
  getAllServiceBookings,
  getServiceBookingById,
  updateServiceBooking,
  deleteServiceBooking
};
