const express = require('express');
const { createCustomer, getAllCustomers } = require('../controllers/customer.controller');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new customer profile
 * @access  Public
 */
router.post('/', createCustomer);

/**
 * @route   GET /
 * @desc    Retrieves all customer records
 * @access  Public
 */
router.get('/', getAllCustomers);

module.exports = router;
