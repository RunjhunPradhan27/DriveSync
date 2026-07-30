const express = require('express');
const { createCustomer, getAllCustomers } = require('../controllers/customer.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new customer profile
 * @access  Private (Authenticated)
 */
router.post('/', authenticateUser, createCustomer);

/**
 * @route   GET /
 * @desc    Retrieves all customer records
 * @access  Private (Authenticated)
 */
router.get('/', authenticateUser, getAllCustomers);

module.exports = router;
