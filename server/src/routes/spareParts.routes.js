const express = require('express');
const { createSparePart, getAllSpareParts } = require('../controllers/spareParts.controller');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new spare part item
 * @access  Public
 */
router.post('/', createSparePart);

/**
 * @route   GET /
 * @desc    Retrieves all spare parts items
 * @access  Public
 */
router.get('/', getAllSpareParts);

module.exports = router;
