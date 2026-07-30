const express = require('express');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @route   POST /register
 * @desc    Registers a new Customer account (users + customers rows created together)
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /login
 * @desc    Authenticates user and returns JWT token
 * @access  Public
 */
router.post('/login', login);

module.exports = router;
