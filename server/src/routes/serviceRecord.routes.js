const express = require('express');
const { createServiceRecord, getAllServiceRecords } = require('../controllers/serviceRecord.controller');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new completed/cancelled service record
 * @access  Public
 */
router.post('/', createServiceRecord);

/**
 * @route   GET /
 * @desc    Retrieves all service execution records
 * @access  Public
 */
router.get('/', getAllServiceRecords);

module.exports = router;
