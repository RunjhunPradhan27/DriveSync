const express = require('express');
const {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory
} = require('../controllers/inventory.controller');
const { authenticateUser } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorize.middleware');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new inventory stock record
 * @access  Private (Admin, Inventory Manager)
 */
router.post('/', authenticateUser, authorize('Admin', 'Inventory Manager'), createInventory);

/**
 * @route   GET /
 * @desc    Retrieves all inventory stock records
 * @access  Private (Admin, Inventory Manager)
 */
router.get('/', authenticateUser, authorize('Admin', 'Inventory Manager'), getAllInventory);

/**
 * @route   GET /:id
 * @desc    Retrieves a single inventory record by inventory_id
 * @access  Private (Admin, Inventory Manager)
 */
router.get('/:id', authenticateUser, authorize('Admin', 'Inventory Manager'), getInventoryById);

/**
 * @route   PUT /:id
 * @desc    Partially updates an inventory record
 * @access  Private (Admin, Inventory Manager)
 */
router.put('/:id', authenticateUser, authorize('Admin', 'Inventory Manager'), updateInventory);

/**
 * @route   DELETE /:id
 * @desc    Deletes an inventory record
 * @access  Private (Admin, Inventory Manager)
 */
router.delete('/:id', authenticateUser, authorize('Admin', 'Inventory Manager'), deleteInventory);

module.exports = router;
