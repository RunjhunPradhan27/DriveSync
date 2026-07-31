const express = require('express');
const { createVehicle, getAllVehicles } = require('../controllers/vehicle.controller');
const { authenticateUser } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorize.middleware');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new vehicle record in inventory
 * @access  Private (Admin, Inventory Manager)
 */
router.post('/', authenticateUser, authorize('Admin', 'Inventory Manager'), createVehicle);

/**
 * @route   GET /
 * @desc    Retrieves all vehicle records from inventory
 * @access  Public
 */
router.get('/', getAllVehicles);

module.exports = router;
