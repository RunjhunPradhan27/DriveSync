const express = require('express');
const { createEmployee, getAllEmployees } = require('../controllers/employee.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route   POST /
 * @desc    Creates a new employee account (Admin-created; users + employees rows created together)
 * @access  Private (Authenticated) — restricting this to Admin specifically is pending RBAC
 */
router.post('/', authenticateUser, createEmployee);

/**
 * @route   GET /
 * @desc    Retrieves all employee records
 * @access  Private (Authenticated)
 */
router.get('/', authenticateUser, getAllEmployees);

module.exports = router;
