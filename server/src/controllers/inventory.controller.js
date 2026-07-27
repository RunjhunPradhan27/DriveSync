const Inventory = require('../models/inventory.model');

/**
 * Inventory Controller
 * Handles incoming HTTP requests, validates input, invokes model operations,
 * and formats HTTP responses for vehicle inventory stock resources.
 */

/**
 * Handles creation of a new inventory record.
 * @param {Object} req - Express request object containing stock details in body
 * @param {Object} res - Express response object
 */
const createInventory = async (req, res) => {
  try {
    const { vehicle_id, quantity, stock_status, storage_location } = req.body;

    // Validate required fields
    if (!vehicle_id || !storage_location) {
      return res.status(400).json({
        status: 'error',
        message: 'vehicle_id and storage_location are required fields.'
      });
    }

    // Call Model to perform database insertion
    const result = await Inventory.create({
      vehicle_id,
      quantity,
      stock_status,
      storage_location
    });

    // Send HTTP 201 Created response
    return res.status(201).json({
      status: 'success',
      message: 'Inventory record created successfully',
      data: {
        inventory_id: result.insertId,
        vehicle_id,
        quantity: quantity !== undefined ? quantity : 0,
        stock_status: stock_status || 'In Stock',
        storage_location
      }
    });
  } catch (error) {
    console.error('Error in createInventory controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating inventory record',
      error: error.message
    });
  }
};

/**
 * Handles fetching all inventory records.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllInventory = async (req, res) => {
  try {
    // Call Model to fetch all inventory records from database
    const records = await Inventory.findAll();

    // Send HTTP 200 OK response
    return res.status(200).json({
      status: 'success',
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Error in getAllInventory controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching inventory records',
      error: error.message
    });
  }
};

module.exports = {
  createInventory,
  getAllInventory
};
