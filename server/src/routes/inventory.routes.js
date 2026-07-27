const express = require('express');
const { createInventory, getAllInventory } = require('../controllers/inventory.controller');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new inventory stock record
 * @access  Public
 */
router.post('/', createInventory);

/**
 * @route   GET /
 * @desc    Retrieves all inventory stock records
 * @access  Public
 */
router.get('/', getAllInventory);

module.exports = router;
