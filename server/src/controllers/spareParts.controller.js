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

module.exports = {
  createSparePart,
  getAllSpareParts
};
