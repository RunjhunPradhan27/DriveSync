const bcrypt = require('bcrypt');
const Employee = require('../models/employee.model');
const User = require('../models/user.model');
const { pool } = require('../config/db');

/**
 * Employee Controller
 * Handles incoming HTTP requests, validates input, invokes model operations,
 * and formats HTTP responses for employee resources.
 */

// Roles an Admin may assign when provisioning an employee account.
// 'Customer' is intentionally excluded — employees are never created with that role.
const ALLOWED_EMPLOYEE_ROLES = ['Admin', 'Sales Executive', 'Technician', 'Inventory Manager'];

/**
 * Handles Admin-created employee account creation.
 * Creates the linked `users` + `employees` rows atomically in a single transaction.
 * Employees never self-register; this endpoint is always Admin-initiated, and the
 * Admin explicitly chooses the role (never inferred, never client-self-asserted).
 * @param {Object} req - Express request object containing account + employee details in body
 * @param {Object} res - Express response object
 */
const createEmployee = async (req, res) => {
  let connection;

  try {
    const {
      username,
      email,
      password,
      role,
      first_name,
      last_name,
      phone,
      designation,
      department,
      hire_date,
      salary
    } = req.body;

    // Validate required fields
    if (
      !username ||
      !email ||
      !password ||
      !role ||
      !first_name ||
      !last_name ||
      !phone ||
      !designation ||
      !department ||
      !hire_date ||
      salary === undefined ||
      salary === null
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'username, email, password, role, first_name, last_name, phone, designation, department, hire_date, and salary are required fields.'
      });
    }

    // Validate the Admin-supplied role against the allowed employee roles
    if (!ALLOWED_EMPLOYEE_ROLES.includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: `role must be one of: ${ALLOWED_EMPLOYEE_ROLES.join(', ')}`
      });
    }

    // Check if user with given email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Hash password with salt rounds = 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the users row and the linked employees row atomically: if either
    // insert fails, the whole operation must roll back rather than leaving an
    // orphaned users row with no matching employee.
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const userResult = await User.create(
      { username, email, password: hashedPassword, role },
      connection
    );
    const user_id = userResult.insertId;

    const employeeResult = await Employee.create(
      { user_id, first_name, last_name, email, phone, designation, department, hire_date, salary },
      connection
    );

    await connection.commit();

    // Send HTTP 201 Created response
    return res.status(201).json({
      status: 'success',
      message: 'Employee created successfully',
      data: {
        employee_id: employeeResult.insertId,
        user_id,
        role,
        first_name,
        last_name,
        email,
        phone,
        designation,
        department,
        hire_date,
        salary
      }
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error in createEmployee controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating employee',
      error: error.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * Handles fetching all employees.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllEmployees = async (req, res) => {
  try {
    // Call Model to fetch all records from database
    const employees = await Employee.findAll();

    // Send HTTP 200 OK response
    return res.status(200).json({
      status: 'success',
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Error in getAllEmployees controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching employees',
      error: error.message
    });
  }
};

/**
 * Handles fetching a single employee by employee_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        status: 'error',
        message: 'Employee not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: employee
    });
  } catch (error) {
    console.error('Error in getEmployeeById controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching employee',
      error: error.message
    });
  }
};

// Profile fields updatable via PUT. Deliberately excludes email/role/user_id:
// email is shared with the linked users row at creation time, role is an
// RBAC-relevant account concern rather than a profile field, and user_id
// must never be reassigned.
const EMPLOYEE_UPDATABLE_FIELDS = ['first_name', 'last_name', 'phone', 'designation', 'department', 'hire_date', 'salary'];

/**
 * Partially updates an employee's profile. Only fields present in the
 * request body are changed.
 * @param {Object} req - Express request object containing fields to update in body
 * @param {Object} res - Express response object
 */
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {};
    EMPLOYEE_UPDATABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: `At least one of the following fields must be provided: ${EMPLOYEE_UPDATABLE_FIELDS.join(', ')}`
      });
    }

    const result = await Employee.update(id, updates);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Employee not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Employee updated successfully',
      data: { employee_id: Number(id), ...updates }
    });
  } catch (error) {
    console.error('Error in updateEmployee controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while updating employee',
      error: error.message
    });
  }
};

/**
 * Deletes an employee by removing the linked users row (which cascades to
 * remove the employees row), so no orphaned login is ever left behind.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        status: 'error',
        message: 'Employee not found'
      });
    }

    await User.deleteById(employee.user_id);

    return res.status(200).json({
      status: 'success',
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    // A RESTRICT foreign key (e.g. existing sales or service records tied to
    // this employee) blocks the delete — surface it as a clear 409, not a generic 500.
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({
        status: 'error',
        message: 'Cannot delete this employee because they have existing sales or service records referencing them.'
      });
    }
    console.error('Error in deleteEmployee controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting employee',
      error: error.message
    });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};
