const express = require('express');
const { createSale, getAllSales } = require('../controllers/sales.controller');
const { authenticateUser } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorize.middleware');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new vehicle sale transaction
 * @access  Private (Admin, Sales Executive)
 */
router.post('/', authenticateUser, authorize('Admin', 'Sales Executive'), createSale);

/**
 * @route   GET /
 * @desc    Retrieves all sales transaction records
 * @access  Private (Admin, Sales Executive)
 */
router.get('/', authenticateUser, authorize('Admin', 'Sales Executive'), getAllSales);

module.exports = router;
