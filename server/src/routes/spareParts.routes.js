const express = require('express');
const {
  createSparePart,
  getAllSpareParts,
  getSparePartById,
  updateSparePart,
  deleteSparePart
} = require('../controllers/spareParts.controller');
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

/**
 * @route   GET /:id
 * @desc    Retrieves a single spare part by part_id
 * @access  Private (Admin, Inventory Manager, Technician)
 */
router.get('/:id', authenticateUser, authorize('Admin', 'Inventory Manager', 'Technician'), getSparePartById);

/**
 * @route   PUT /:id
 * @desc    Partially updates a spare part record
 * @access  Private (Admin, Inventory Manager)
 */
router.put('/:id', authenticateUser, authorize('Admin', 'Inventory Manager'), updateSparePart);

/**
 * @route   DELETE /:id
 * @desc    Deletes a spare part record
 * @access  Private (Admin, Inventory Manager)
 */
router.delete('/:id', authenticateUser, authorize('Admin', 'Inventory Manager'), deleteSparePart);

module.exports = router;
