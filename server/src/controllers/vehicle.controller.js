const Vehicle = require('../models/vehicle.model');

/**
 * Vehicle Controller
 * Handles incoming HTTP requests, validates input, invokes model operations,
 * and formats HTTP responses for vehicle inventory resources.
 */

/**
 * Handles creation of a new vehicle record.
 * @param {Object} req - Express request object containing vehicle specifications in body
 * @param {Object} res - Express response object
 */
const createVehicle = async (req, res) => {
  try {
    const {
      make,
      model,
      model_year,
      color,
      fuel_type,
      transmission,
      price,
      vin,
      status
    } = req.body;

    // Validate required fields
    if (
      !make ||
      !model ||
      !model_year ||
      !fuel_type ||
      !transmission ||
      price === undefined ||
      price === null ||
      !vin
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'make, model, model_year, fuel_type, transmission, price, and vin are required fields.'
      });
    }

    // Call Model to perform database insertion
    const result = await Vehicle.create({
      make,
      model,
      model_year,
      color,
      fuel_type,
      transmission,
      price,
      vin,
      status
    });

    // Send HTTP 201 Created response
    return res.status(201).json({
      status: 'success',
      message: 'Vehicle created successfully',
      data: {
        vehicle_id: result.insertId,
        make,
        model,
        model_year,
        color: color || null,
        fuel_type,
        transmission,
        price,
        vin,
        status: status || 'Available'
      }
    });
  } catch (error) {
    console.error('Error in createVehicle controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating vehicle',
      error: error.message
    });
  }
};

/**
 * Handles fetching all vehicles from inventory.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllVehicles = async (req, res) => {
  try {
    // Call Model to fetch all vehicle records from database
    const vehicles = await Vehicle.findAll();

    // Send HTTP 200 OK response
    return res.status(200).json({
      status: 'success',
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    console.error('Error in getAllVehicles controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching vehicles',
      error: error.message
    });
  }
};

/**
 * Handles fetching a single vehicle by vehicle_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({
        status: 'error',
        message: 'Vehicle not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: vehicle
    });
  } catch (error) {
    console.error('Error in getVehicleById controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching vehicle',
      error: error.message
    });
  }
};

const VEHICLE_UPDATABLE_FIELDS = [
  'make', 'model', 'model_year', 'color', 'fuel_type', 'transmission', 'price', 'vin', 'status'
];

/**
 * Partially updates a vehicle record. Only fields present in the request
 * body are changed.
 * @param {Object} req - Express request object containing fields to update in body
 * @param {Object} res - Express response object
 */
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {};
    VEHICLE_UPDATABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: `At least one of the following fields must be provided: ${VEHICLE_UPDATABLE_FIELDS.join(', ')}`
      });
    }

    const result = await Vehicle.update(id, updates);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Vehicle not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Vehicle updated successfully',
      data: { vehicle_id: Number(id), ...updates }
    });
  } catch (error) {
    console.error('Error in updateVehicle controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while updating vehicle',
      error: error.message
    });
  }
};

/**
 * Deletes a vehicle by vehicle_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Vehicle.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Vehicle not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({
        status: 'error',
        message: 'Cannot delete this vehicle because it is referenced by existing inventory or sales records.'
      });
    }
    console.error('Error in deleteVehicle controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting vehicle',
      error: error.message
    });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};
