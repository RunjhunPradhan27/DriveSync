const express = require('express');
const { createEmployee, getAllEmployees } = require('../controllers/employee.controller');
const { authenticateUser } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorize.middleware');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new employee account (Admin-created; users + employees rows created together)
 * @access  Private (Admin)
 */
router.post('/', authenticateUser, authorize('Admin'), createEmployee);

/**
 * @route   GET /
 * @desc    Retrieves all employee records
 * @access  Private (Admin)
 */
router.get('/', authenticateUser, authorize('Admin'), getAllEmployees);

module.exports = router;
