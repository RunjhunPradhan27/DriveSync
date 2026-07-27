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

module.exports = {
  createSale,
  getAllSales
};
