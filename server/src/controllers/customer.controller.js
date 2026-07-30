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

module.exports = {
  createCustomer,
  getAllCustomers
};
