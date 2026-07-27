const express = require('express');
const { createVehicle, getAllVehicles } = require('../controllers/vehicle.controller');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new vehicle record in inventory
 * @access  Public
 */
router.post('/', createVehicle);

/**
 * @route   GET /
 * @desc    Retrieves all vehicle records from inventory
 * @access  Public
 */
router.get('/', getAllVehicles);

module.exports = router;
