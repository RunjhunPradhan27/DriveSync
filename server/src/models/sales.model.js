const { pool } = require('../config/db');

/**
 * Sales Model
 * Handles raw database operations for the 'sales' table.
 */
const Sales = {
  /**
   * Inserts a new sale record into the database.
   * @param {Object} saleData - { customer_id, vehicle_id, employee_id, sale_date, sale_price, payment_method, sale_status }
   * @returns {Promise<Object>} MySQL result object containing insertId, affectedRows, etc.
   */
  create: async (saleData) => {
    const {
      customer_id,
      vehicle_id,
      employee_id,
      sale_date,
      sale_price,
      payment_method,
      sale_status
    } = saleData;

    const query = `
      INSERT INTO sales (customer_id, vehicle_id, employee_id, sale_date, sale_price, payment_method, sale_status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      customer_id,
      vehicle_id,
      employee_id,
      sale_date,
      sale_price,
      payment_method,
      sale_status || 'Pending'
    ]);

    return result;
  },

  /**
   * Fetches all sales records from the database.
   * @returns {Promise<Array>} Array of sales row objects.
   */
  findAll: async () => {
    const query = `
      SELECT sale_id, customer_id, vehicle_id, employee_id, sale_date, sale_price, payment_method, sale_status, created_at, updated_at
      FROM sales
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.query(query);
    return rows;
  },

  /**
   * Fetches a single sale record by sale_id.
   * @param {number} sale_id
   * @returns {Promise<Object|null>} Sale row, or null if not found.
   */
  findById: async (sale_id) => {
    const query = `
      SELECT sale_id, customer_id, vehicle_id, employee_id, sale_date, sale_price, payment_method, sale_status, created_at, updated_at
      FROM sales
      WHERE sale_id = ?
    `;
    const [rows] = await pool.query(query, [sale_id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Partially updates a sale record. Only columns present in `updates`
   * are written; the caller is responsible for whitelisting allowed fields.
   * @param {number} sale_id
   * @param {Object} updates - Plain object of column: value pairs to update
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  update: async (sale_id, updates) => {
    const fields = Object.keys(updates);
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => updates[field]);

    const query = `UPDATE sales SET ${setClause} WHERE sale_id = ?`;
    const [result] = await pool.execute(query, [...values, sale_id]);
    return result;
  },

  /**
   * Deletes a sale record by sale_id.
   * @param {number} sale_id
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  delete: async (sale_id) => {
    const query = `DELETE FROM sales WHERE sale_id = ?`;
    const [result] = await pool.execute(query, [sale_id]);
    return result;
  }
};

module.exports = Sales;
