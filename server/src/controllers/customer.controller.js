const bcrypt = require('bcrypt');
const Customer = require('../models/customer.model');
const User = require('../models/user.model');
const { pool } = require('../config/db');

/**
 * Customer Controller
 * Handles incoming HTTP requests, validates input, invokes model operations,
 * and formats HTTP responses for customer resources.
 */

/**
 * Handles Admin-created customer account creation.
 * Creates the linked `users` + `customers` rows atomically in a single transaction,
 * mirroring the self-registration flow in auth.controller.js — the only difference
 * is that the caller here is an Admin, not the account owner, so no JWT is issued.
 * @param {Object} req - Express request object containing account + customer details in body
 * @param {Object} res - Express response object
 */
const createCustomer = async (req, res) => {
  let connection;

  try {
    const { username, email, password, first_name, last_name, phone, address, city } = req.body;

    // Validate required fields
    if (!username || !email || !password || !first_name || !last_name || !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'username, email, password, first_name, last_name, and phone are required fields.'
      });
    }

    // Check if user with given email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Hash password with salt rounds = 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Customer accounts created through this endpoint always get role = 'Customer'
    const role = 'Customer';

    // Create the users row and the linked customers row atomically: if either
    // insert fails, the whole operation must roll back rather than leaving an
    // orphaned users row with no matching customer.
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const userResult = await User.create(
      { username, email, password: hashedPassword, role },
      connection
    );
    const user_id = userResult.insertId;

    const customerResult = await Customer.create(
      { user_id, first_name, last_name, email, phone, address, city },
      connection
    );

    await connection.commit();

    // Send HTTP 201 Created response
    return res.status(201).json({
      status: 'success',
      message: 'Customer created successfully',
      data: {
        customer_id: customerResult.insertId,
        user_id,
        first_name,
        last_name,
        email,
        phone,
        address,
        city
      }
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error in createCustomer controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating customer',
      error: error.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
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

/**
 * Handles fetching a single customer by customer_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: customer
    });
  } catch (error) {
    console.error('Error in getCustomerById controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching customer',
      error: error.message
    });
  }
};

// Profile fields updatable via PUT. Deliberately excludes email/user_id: email
// is shared with the linked users row at creation time and changing it here
// would desync the login identity; user_id must never be reassigned.
const CUSTOMER_UPDATABLE_FIELDS = ['first_name', 'last_name', 'phone', 'address', 'city'];

/**
 * Partially updates a customer's profile. Only fields present in the request
 * body are changed.
 * @param {Object} req - Express request object containing fields to update in body
 * @param {Object} res - Express response object
 */
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {};
    CUSTOMER_UPDATABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: `At least one of the following fields must be provided: ${CUSTOMER_UPDATABLE_FIELDS.join(', ')}`
      });
    }

    const result = await Customer.update(id, updates);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Customer updated successfully',
      data: { customer_id: Number(id), ...updates }
    });
  } catch (error) {
    console.error('Error in updateCustomer controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while updating customer',
      error: error.message
    });
  }
};

/**
 * Deletes a customer by removing the linked users row (which cascades to
 * remove the customers row), so no orphaned login is ever left behind.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found'
      });
    }

    await User.deleteById(customer.user_id);

    return res.status(200).json({
      status: 'success',
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    // A RESTRICT foreign key (e.g. an existing sales record for this customer)
    // blocks the delete — surface it as a clear 409, not a generic 500.
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({
        status: 'error',
        message: 'Cannot delete this customer because they have existing sales records referencing them.'
      });
    }
    console.error('Error in deleteCustomer controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting customer',
      error: error.message
    });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};
