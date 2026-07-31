const express = require('express');
const { createCustomer, getAllCustomers } = require('../controllers/customer.controller');
const { authenticateUser } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorize.middleware');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new customer account (Admin-created; users + customers rows created together)
 * @access  Private (Admin, Sales Executive)
 */
router.post('/', authenticateUser, authorize('Admin', 'Sales Executive'), createCustomer);

/**
 * @route   GET /
 * @desc    Retrieves all customer records
 * @access  Private (Admin, Sales Executive)
 */
router.get('/', authenticateUser, authorize('Admin', 'Sales Executive'), getAllCustomers);

module.exports = router;
