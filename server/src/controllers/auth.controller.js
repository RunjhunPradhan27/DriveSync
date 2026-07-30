const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Auth Controller
 * Handles user registration, credential verification, password hashing, and JWT token issuance.
 */

/**
 * Handles user account registration.
 * @param {Object} req - Express request object containing registration details in body
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        status: 'error',
        message: 'username, email, password, and role are required fields.'
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

    // Insert user into database
    await User.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    // Return HTTP 201 Created
    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Error in register controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during user registration',
      error: error.message
    });
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
      message: 'Internal server error during login'
    });
  }
};

module.exports = {
  register,
  login
};
