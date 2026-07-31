const express = require('express');
const { createSparePart, getAllSpareParts } = require('../controllers/spareParts.controller');
const { authenticateUser } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorize.middleware');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new spare part item
 * @access  Private (Admin, Inventory Manager)
 */
router.post('/', authenticateUser, authorize('Admin', 'Inventory Manager'), createSparePart);

/**
 * @route   GET /
 * @desc    Retrieves all spare parts items
 * @access  Private (Admin, Inventory Manager, Technician)
 */
router.get('/', authenticateUser, authorize('Admin', 'Inventory Manager', 'Technician'), getAllSpareParts);

module.exports = router;
