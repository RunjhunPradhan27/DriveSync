const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Customer = require('../models/customer.model');
const { pool } = require('../config/db');

/**
 * Auth Controller
 * Handles user registration, credential verification, password hashing, and JWT token issuance.
 */

/**
 * Handles self-service registration for Customer accounts.
 * Creates a linked `users` + `customers` row in a single transaction.
 * Employee-type accounts (Admin, Sales Executive, Technician, Inventory Manager) are
 * provisioned later through Admin functionality and are never created here.
 * @param {Object} req - Express request object containing registration details in body
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
  let connection;

  try {
    const { username, email, password, first_name, last_name, phone, address, city } = req.body;

    // Validate required fields. Note: `role` is intentionally never read from the
    // request body — self-registration always creates a Customer account.
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
    const role = 'Customer';

    // Create the users row and the linked customers row atomically: if either
    // insert fails, the whole registration must roll back rather than leaving
    // an orphaned users row with no matching customer.
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const userResult = await User.create(
      { username, email, password: hashedPassword, role },
      connection
    );
    const user_id = userResult.insertId;

    await Customer.create(
      { user_id, first_name, last_name, email, phone, address, city },
      connection
    );

    await connection.commit();

    // Generate JWT valid for 1 hour
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user_id, role },
      secretKey,
      { expiresIn: '1h' }
    );

    // Return HTTP 201 Created
    return res.status(201).json({
      status: 'success',
      message: 'Customer registered successfully',
      token
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error in register controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during user registration',
      error: error.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * Handles user login and JWT generation.
 * @param {Object} req - Express request object containing login credentials
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'email and password are required fields.'
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Compare plain-text password against hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token valid for 1 hour
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role
      },
      secretKey,
      {
        expiresIn: '1h'
      }
    );

    // Return HTTP 200 OK with token
    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error('Error in login controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during login',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login
};
