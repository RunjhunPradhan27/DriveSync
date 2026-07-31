const express = require('express');
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicle.controller');
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

/**
 * @route   GET /:id
 * @desc    Retrieves a single vehicle record by vehicle_id
 * @access  Public
 */
router.get('/:id', getVehicleById);

/**
 * @route   PUT /:id
 * @desc    Partially updates a vehicle record
 * @access  Private (Admin, Inventory Manager)
 */
router.put('/:id', authenticateUser, authorize('Admin', 'Inventory Manager'), updateVehicle);

/**
 * @route   DELETE /:id
 * @desc    Deletes a vehicle record
 * @access  Private (Admin, Inventory Manager)
 */
router.delete('/:id', authenticateUser, authorize('Admin', 'Inventory Manager'), deleteVehicle);

module.exports = router;
