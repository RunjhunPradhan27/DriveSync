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

/**
 * Handles fetching a single inventory record by inventory_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Inventory.findById(id);

    if (!record) {
      return res.status(404).json({
        status: 'error',
        message: 'Inventory record not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: record
    });
  } catch (error) {
    console.error('Error in getInventoryById controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching inventory record',
      error: error.message
    });
  }
};

const INVENTORY_UPDATABLE_FIELDS = ['vehicle_id', 'quantity', 'stock_status', 'storage_location'];

/**
 * Partially updates an inventory record. Only fields present in the request
 * body are changed.
 * @param {Object} req - Express request object containing fields to update in body
 * @param {Object} res - Express response object
 */
const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {};
    INVENTORY_UPDATABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: `At least one of the following fields must be provided: ${INVENTORY_UPDATABLE_FIELDS.join(', ')}`
      });
    }

    const result = await Inventory.update(id, updates);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Inventory record not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Inventory record updated successfully',
      data: { inventory_id: Number(id), ...updates }
    });
  } catch (error) {
    console.error('Error in updateInventory controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while updating inventory record',
      error: error.message
    });
  }
};

/**
 * Deletes an inventory record by inventory_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Inventory.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Inventory record not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Inventory record deleted successfully'
    });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({
        status: 'error',
        message: 'Cannot delete this inventory record because it is referenced by other records.'
      });
    }
    console.error('Error in deleteInventory controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting inventory record',
      error: error.message
    });
  }
};

module.exports = {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory
};
