const ServiceRecord = require('../models/serviceRecord.model');

/**
 * ServiceRecord Controller
 * Handles incoming HTTP requests, validates input, invokes model operations,
 * and formats HTTP responses for service record resources.
 */

/**
 * Handles creation of a new service execution record.
 * @param {Object} req - Express request object containing record details in body
 * @param {Object} res - Express response object
 */
const createServiceRecord = async (req, res) => {
  try {
    const {
      booking_id,
      employee_id,
      work_description,
      labour_cost,
      parts_cost,
      total_cost,
      completion_date,
      service_status
    } = req.body;

    // Validate required fields
    if (
      !booking_id ||
      !employee_id ||
      !work_description ||
      labour_cost === undefined ||
      labour_cost === null ||
      total_cost === undefined ||
      total_cost === null ||
      !completion_date
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'booking_id, employee_id, work_description, labour_cost, total_cost, and completion_date are required fields.'
      });
    }

    // Call Model to perform database insertion
    const result = await ServiceRecord.create({
      booking_id,
      employee_id,
      work_description,
      labour_cost,
      parts_cost,
      total_cost,
      completion_date,
      service_status
    });

    // Send HTTP 201 Created response
    return res.status(201).json({
      status: 'success',
      message: 'Service record created successfully',
      data: {
        record_id: result.insertId,
        booking_id,
        employee_id,
        work_description,
        labour_cost,
        parts_cost: parts_cost || 0.00,
        total_cost,
        completion_date,
        service_status: service_status || 'Completed'
      }
    });
  } catch (error) {
    console.error('Error in createServiceRecord controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating service record',
      error: error.message
    });
  }
};

/**
 * Handles fetching all service records.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllServiceRecords = async (req, res) => {
  try {
    // Call Model to fetch all records from database
    const records = await ServiceRecord.findAll();

    // Send HTTP 200 OK response
    return res.status(200).json({
      status: 'success',
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Error in getAllServiceRecords controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching service records',
      error: error.message
    });
  }
};

/**
 * Handles fetching a single service record by record_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getServiceRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await ServiceRecord.findById(id);

    if (!record) {
      return res.status(404).json({
        status: 'error',
        message: 'Service record not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: record
    });
  } catch (error) {
    console.error('Error in getServiceRecordById controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching service record',
      error: error.message
    });
  }
};

const SERVICE_RECORD_UPDATABLE_FIELDS = [
  'booking_id', 'employee_id', 'work_description', 'labour_cost', 'parts_cost', 'total_cost', 'completion_date', 'service_status'
];

/**
 * Partially updates a service record. Only fields present in the request
 * body are changed.
 * @param {Object} req - Express request object containing fields to update in body
 * @param {Object} res - Express response object
 */
const updateServiceRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {};
    SERVICE_RECORD_UPDATABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: `At least one of the following fields must be provided: ${SERVICE_RECORD_UPDATABLE_FIELDS.join(', ')}`
      });
    }

    const result = await ServiceRecord.update(id, updates);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Service record not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Service record updated successfully',
      data: { record_id: Number(id), ...updates }
    });
  } catch (error) {
    console.error('Error in updateServiceRecord controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while updating service record',
      error: error.message
    });
  }
};

/**
 * Deletes a service record by record_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteServiceRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ServiceRecord.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Service record not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Service record deleted successfully'
    });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({
        status: 'error',
        message: 'Cannot delete this service record because it is referenced by other records.'
      });
    }
    console.error('Error in deleteServiceRecord controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting service record',
      error: error.message
    });
  }
};

module.exports = {
  createServiceRecord,
  getAllServiceRecords,
  getServiceRecordById,
  updateServiceRecord,
  deleteServiceRecord
};
