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

module.exports = {
  createVehicle,
  getAllVehicles
};
