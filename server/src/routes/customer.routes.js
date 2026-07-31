const express = require('express');
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customer.controller');
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

/**
 * @route   GET /:id
 * @desc    Retrieves a single customer record by customer_id
 * @access  Private (Admin, Sales Executive)
 */
router.get('/:id', authenticateUser, authorize('Admin', 'Sales Executive'), getCustomerById);

/**
 * @route   PUT /:id
 * @desc    Partially updates a customer's profile fields
 * @access  Private (Admin, Sales Executive)
 */
router.put('/:id', authenticateUser, authorize('Admin', 'Sales Executive'), updateCustomer);

/**
 * @route   DELETE /:id
 * @desc    Deletes a customer (via the linked users row, cascading cleanly)
 * @access  Private (Admin, Sales Executive)
 */
router.delete('/:id', authenticateUser, authorize('Admin', 'Sales Executive'), deleteCustomer);

module.exports = router;
