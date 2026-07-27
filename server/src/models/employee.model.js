const { pool } = require('../config/db');

/**
 * Employee Model
 * Handles raw database operations for the 'employees' table.
 */
const Employee = {
  /**
   * Inserts a new employee record into the employees table.
   * @param {Object} employeeData - { first_name, last_name, email, phone, designation, department, hire_date, salary }
   * @returns {Promise<Object>} MySQL result object containing insertId, affectedRows, etc.
   */
  create: async (employeeData) => {
    const {
      first_name,
      last_name,
      email,
      phone,
      designation,
      department,
      hire_date,
      salary
    } = employeeData;

    const query = `
      INSERT INTO employees (first_name, last_name, email, phone, designation, department, hire_date, salary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      first_name,
      last_name,
      email,
      phone,
      designation,
      department,
      hire_date,
      salary
    ]);

    return result;
  },

  /**
   * Fetches all employee records from the employees table.
   * @returns {Promise<Array>} Array of employee row objects.
   */
  findAll: async () => {
    const query = `
      SELECT employee_id, first_name, last_name, email, phone, designation, department, hire_date, salary, created_at, updated_at
      FROM employees
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.query(query);
    return rows;
  }
};

module.exports = Employee;
