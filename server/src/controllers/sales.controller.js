const Sales = require('../models/sales.model');

/**
 * Sales Controller
 * Handles incoming HTTP requests, validates input, invokes model operations,
 * and formats HTTP responses for sales transaction resources.
 */

/**
 * Handles creation of a new sales transaction.
 * @param {Object} req - Express request object containing sale details in body
 * @param {Object} res - Express response object
 */
const createSale = async (req, res) => {
  try {
    const {
      customer_id,
      vehicle_id,
      employee_id,
      sale_date,
      sale_price,
      payment_method,
      sale_status
    } = req.body;

    // Validate required fields
    if (
      !customer_id ||
      !vehicle_id ||
      !employee_id ||
      !sale_date ||
      sale_price === undefined ||
      sale_price === null ||
      !payment_method
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'customer_id, vehicle_id, employee_id, sale_date, sale_price, and payment_method are required fields.'
      });
    }

    // Call Model to perform database insertion
    const result = await Sales.create({
      customer_id,
      vehicle_id,
      employee_id,
      sale_date,
      sale_price,
      payment_method,
      sale_status
    });

    // Send HTTP 201 Created response
    return res.status(201).json({
      status: 'success',
      message: 'Sale created successfully',
      data: {
        sale_id: result.insertId,
        customer_id,
        vehicle_id,
        employee_id,
        sale_date,
        sale_price,
        payment_method,
        sale_status: sale_status || 'Pending'
      }
    });
  } catch (error) {
    console.error('Error in createSale controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating sale',
      error: error.message
    });
  }
};

/**
 * Handles fetching all sales transactions.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllSales = async (req, res) => {
  try {
    // Call Model to fetch all sales from database
    const sales = await Sales.findAll();

    // Send HTTP 200 OK response
    return res.status(200).json({
      status: 'success',
      count: sales.length,
      data: sales
    });
  } catch (error) {
    console.error('Error in getAllSales controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching sales',
      error: error.message
    });
  }
};

/**
 * Handles fetching a single sale by sale_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sales.findById(id);

    if (!sale) {
      return res.status(404).json({
        status: 'error',
        message: 'Sale not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: sale
    });
  } catch (error) {
    console.error('Error in getSaleById controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching sale',
      error: error.message
    });
  }
};

const SALE_UPDATABLE_FIELDS = [
  'customer_id', 'vehicle_id', 'employee_id', 'sale_date', 'sale_price', 'payment_method', 'sale_status'
];

/**
 * Partially updates a sale record. Only fields present in the request body
 * are changed.
 * @param {Object} req - Express request object containing fields to update in body
 * @param {Object} res - Express response object
 */
const updateSale = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {};
    SALE_UPDATABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: `At least one of the following fields must be provided: ${SALE_UPDATABLE_FIELDS.join(', ')}`
      });
    }

    const result = await Sales.update(id, updates);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Sale not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Sale updated successfully',
      data: { sale_id: Number(id), ...updates }
    });
  } catch (error) {
    console.error('Error in updateSale controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while updating sale',
      error: error.message
    });
  }
};

/**
 * Deletes a sale by sale_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Sales.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Sale not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Sale deleted successfully'
    });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({
        status: 'error',
        message: 'Cannot delete this sale because it is referenced by other records.'
      });
    }
    console.error('Error in deleteSale controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting sale',
      error: error.message
    });
  }
};

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale
};
