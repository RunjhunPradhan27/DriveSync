const Customer = require('../models/customer.model');

/**
 * Customer Controller
 * Handles incoming HTTP requests, validates input, invokes model operations,
 * and formats HTTP responses for customer resources.
 */

/**
 * Handles creation of a new customer.
 * @param {Object} req - Express request object containing customer details in body
 * @param {Object} res - Express response object
 */
const createCustomer = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, address, city } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email || !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'first_name, last_name, email, and phone are required fields.'
      });
    }

    // Call Model to perform SQL INSERT operation
    const result = await Customer.create({
      first_name,
      last_name,
      email,
      phone,
      address,
      city
    });

    // Send HTTP 201 Created response
    return res.status(201).json({
      status: 'success',
      message: 'Customer created successfully',
      data: {
        customer_id: result.insertId,
        first_name,
        last_name,
        email,
        phone,
        address,
        city
      }
    });
  } catch (error) {
    console.error('Error in createCustomer controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating customer',
      error: error.message
    });
  }
};

/**
 * Handles fetching all customers.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllCustomers = async (req, res) => {
  try {
    // Call Model to fetch all records from database
    const customers = await Customer.findAll();

    // Send HTTP 200 OK response
    return res.status(200).json({
      status: 'success',
      count: customers.length,
      data: customers
    });
  } catch (error) {
    console.error('Error in getAllCustomers controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching customers',
      error: error.message
    });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers
};
