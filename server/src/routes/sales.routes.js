const express = require('express');
const { createSale, getAllSales } = require('../controllers/sales.controller');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new vehicle sale transaction
 * @access  Public
 */
router.post('/', createSale);

/**
 * @route   GET /
 * @desc    Retrieves all sales transaction records
 * @access  Public
 */
router.get('/', getAllSales);

module.exports = router;
