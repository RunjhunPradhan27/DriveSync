const express = require('express');
const { createEmployee, getAllEmployees } = require('../controllers/employee.controller');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new employee record
 * @access  Public
 */
router.post('/', createEmployee);

/**
 * @route   GET /
 * @desc    Retrieves all employee records
 * @access  Public
 */
router.get('/', getAllEmployees);

module.exports = router;
