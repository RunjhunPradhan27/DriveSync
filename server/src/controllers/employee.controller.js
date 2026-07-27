const Employee = require('../models/employee.model');

/**
 * Employee Controller
 * Handles incoming HTTP requests, validates input, invokes model operations,
 * and formats HTTP responses for employee resources.
 */

/**
 * Handles creation of a new employee.
 * @param {Object} req - Express request object containing employee details in body
 * @param {Object} res - Express response object
 */
const createEmployee = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      designation,
      department,
      hire_date,
      salary
    } = req.body;

    // Validate required fields
    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !designation ||
      !department ||
      !hire_date ||
      salary === undefined ||
      salary === null
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'first_name, last_name, email, phone, designation, department, hire_date, and salary are required fields.'
      });
    }

    // Call Model to perform database insertion
    const result = await Employee.create({
      first_name,
      last_name,
      email,
      phone,
      designation,
      department,
      hire_date,
      salary
    });

    // Send HTTP 201 Created response
    return res.status(201).json({
      status: 'success',
      message: 'Employee created successfully',
      data: {
        employee_id: result.insertId,
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
    console.error('Error in createEmployee controller:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating employee',
      error: error.message
    });
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

module.exports = {
  createEmployee,
  getAllEmployees
};
