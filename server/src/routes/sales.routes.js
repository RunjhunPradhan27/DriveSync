const express = require('express');
const {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale
} = require('../controllers/sales.controller');
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

/**
 * @route   GET /:id
 * @desc    Retrieves a single sale record by sale_id
 * @access  Private (Admin, Sales Executive)
 */
router.get('/:id', authenticateUser, authorize('Admin', 'Sales Executive'), getSaleById);

/**
 * @route   PUT /:id
 * @desc    Partially updates a sale record
 * @access  Private (Admin, Sales Executive)
 */
router.put('/:id', authenticateUser, authorize('Admin', 'Sales Executive'), updateSale);

/**
 * @route   DELETE /:id
 * @desc    Deletes a sale record
 * @access  Private (Admin, Sales Executive)
 */
router.delete('/:id', authenticateUser, authorize('Admin', 'Sales Executive'), deleteSale);

module.exports = router;
