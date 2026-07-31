const express = require('express');
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employee.controller');
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

/**
 * @route   GET /:id
 * @desc    Retrieves a single employee record by employee_id
 * @access  Private (Admin)
 */
router.get('/:id', authenticateUser, authorize('Admin'), getEmployeeById);

/**
 * @route   PUT /:id
 * @desc    Partially updates an employee's profile fields
 * @access  Private (Admin)
 */
router.put('/:id', authenticateUser, authorize('Admin'), updateEmployee);

/**
 * @route   DELETE /:id
 * @desc    Deletes an employee (via the linked users row, cascading cleanly)
 * @access  Private (Admin)
 */
router.delete('/:id', authenticateUser, authorize('Admin'), deleteEmployee);

module.exports = router;
