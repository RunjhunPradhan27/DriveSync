const express = require('express');
const { createInventory, getAllInventory } = require('../controllers/inventory.controller');
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

module.exports = router;
