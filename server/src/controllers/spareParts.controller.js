const SpareParts = require('../models/spareParts.model');

/**
 * SpareParts Controller
 * Handles incoming HTTP requests, validates input, invokes model operations,
 * and formats HTTP responses for spare parts resources.
 */

/**
 * Handles creation of a new spare part item.
 * @param {Object} req - Express request object containing part details in body
 * @param {Object} res - Express response object
 */
const createSparePart = async (req, res) => {
  try {
    const { part_name, part_number, quantity, unit_price, supplier_name } = req.body;

    // Validate required fields
    if (
      !part_name ||
      !part_number ||
      unit_price === undefined ||
      unit_price === null ||
      !supplier_name
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'part_name, part_number, unit_price, and supplier_name are required fields.'
      });
    }

    // Call Model to perform database insertion
    const result = await SpareParts.create({
      part_name,
      part_number,
      quantity,
      unit_price,
      supplier_name
    });

    // Send HTTP 201 Created response
    return res.status(201).json({
      status: 'success',
      message: 'Spare part created successfully',
      data: {
        part_id: result.insertId,
        part_name,
        part_number,
        quantity: quantity !== undefined ? quantity : 0,
        unit_price,
        supplier_name
      }
    });
  } catch (error) {
    console.error('Error in createSparePart controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating spare part',
      error: error.message
    });
  }
};

/**
 * Handles fetching all spare parts items.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllSpareParts = async (req, res) => {
  try {
    // Call Model to fetch all spare parts from database
    const parts = await SpareParts.findAll();

    // Send HTTP 200 OK response
    return res.status(200).json({
      status: 'success',
      count: parts.length,
      data: parts
    });
  } catch (error) {
    console.error('Error in getAllSpareParts controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching spare parts',
      error: error.message
    });
  }
};

/**
 * Handles fetching a single spare part by part_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSparePartById = async (req, res) => {
  try {
    const { id } = req.params;
    const part = await SpareParts.findById(id);

    if (!part) {
      return res.status(404).json({
        status: 'error',
        message: 'Spare part not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: part
    });
  } catch (error) {
    console.error('Error in getSparePartById controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching spare part',
      error: error.message
    });
  }
};

const SPARE_PART_UPDATABLE_FIELDS = ['part_name', 'part_number', 'quantity', 'unit_price', 'supplier_name'];

/**
 * Partially updates a spare part record. Only fields present in the request
 * body are changed.
 * @param {Object} req - Express request object containing fields to update in body
 * @param {Object} res - Express response object
 */
const updateSparePart = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {};
    SPARE_PART_UPDATABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: `At least one of the following fields must be provided: ${SPARE_PART_UPDATABLE_FIELDS.join(', ')}`
      });
    }

    const result = await SpareParts.update(id, updates);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Spare part not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Spare part updated successfully',
      data: { part_id: Number(id), ...updates }
    });
  } catch (error) {
    console.error('Error in updateSparePart controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while updating spare part',
      error: error.message
    });
  }
};

/**
 * Deletes a spare part by part_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteSparePart = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SpareParts.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Spare part not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Spare part deleted successfully'
    });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({
        status: 'error',
        message: 'Cannot delete this spare part because it is referenced by other records.'
      });
    }
    console.error('Error in deleteSparePart controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting spare part',
      error: error.message
    });
  }
};

module.exports = {
  createSparePart,
  getAllSpareParts,
  getSparePartById,
  updateSparePart,
  deleteSparePart
};
