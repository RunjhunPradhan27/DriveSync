const express = require('express');
const { createServiceRecord, getAllServiceRecords } = require('../controllers/serviceRecord.controller');
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

module.exports = router;
