const { pool } = require('../config/db');

/**
 * Employee Model
 * Handles raw database operations for the 'employees' table.
 */
const Employee = {
  /**
   * Inserts a new employee record into the employees table.
   * @param {Object} employeeData - { user_id, first_name, last_name, email, phone, designation, department, hire_date, salary }
   * @param {Object} [connection=pool] - Active transaction connection, or the pool for standalone use
   * @returns {Promise<Object>} MySQL result object containing insertId, affectedRows, etc.
   */
  create: async (employeeData, connection = pool) => {
    const {
      user_id,
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
      INSERT INTO employees (user_id, first_name, last_name, email, phone, designation, department, hire_date, salary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      user_id ?? null,
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
  },

  /**
   * Fetches a single employee record by employee_id. Includes user_id so
   * callers (e.g. deleteEmployee) can act on the linked users row.
   * @param {number} employee_id
   * @returns {Promise<Object|null>} Employee row, or null if not found.
   */
  findById: async (employee_id) => {
    const query = `
      SELECT employee_id, user_id, first_name, last_name, email, phone, designation, department, hire_date, salary, created_at, updated_at
      FROM employees
      WHERE employee_id = ?
    `;
    const [rows] = await pool.query(query, [employee_id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Partially updates an employee record. Only columns present in `updates`
   * are written; the caller is responsible for whitelisting allowed fields.
   * @param {number} employee_id
   * @param {Object} updates - Plain object of column: value pairs to update
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  update: async (employee_id, updates) => {
    const fields = Object.keys(updates);
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => updates[field]);

    const query = `UPDATE employees SET ${setClause} WHERE employee_id = ?`;
    const [result] = await pool.execute(query, [...values, employee_id]);
    return result;
  }
};

module.exports = Employee;
