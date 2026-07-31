const express = require('express');
const {
  createServiceRecord,
  getAllServiceRecords,
  getServiceRecordById,
  updateServiceRecord,
  deleteServiceRecord
} = require('../controllers/serviceRecord.controller');
const { authenticateUser } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorize.middleware');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new completed/cancelled service record
 * @access  Private (Admin, Technician)
 */
router.post('/', authenticateUser, authorize('Admin', 'Technician'), createServiceRecord);

/**
 * @route   GET /
 * @desc    Retrieves all service execution records
 * @access  Private (Admin, Technician)
 */
router.get('/', authenticateUser, authorize('Admin', 'Technician'), getAllServiceRecords);

/**
 * @route   GET /:id
 * @desc    Retrieves a single service record by record_id
 * @access  Private (Admin, Technician)
 */
router.get('/:id', authenticateUser, authorize('Admin', 'Technician'), getServiceRecordById);

/**
 * @route   PUT /:id
 * @desc    Partially updates a service record
 * @access  Private (Admin, Technician)
 */
router.put('/:id', authenticateUser, authorize('Admin', 'Technician'), updateServiceRecord);

/**
 * @route   DELETE /:id
 * @desc    Deletes a service record
 * @access  Private (Admin, Technician)
 */
router.delete('/:id', authenticateUser, authorize('Admin', 'Technician'), deleteServiceRecord);

module.exports = router;
