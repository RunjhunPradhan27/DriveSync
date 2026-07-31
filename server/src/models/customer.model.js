const { pool } = require('../config/db');

/**
 * Customer Model
 * Handles raw database operations for the 'customers' table.
 */
const Customer = {
  /**
   * Inserts a new customer record into the customers table.
   * @param {Object} customerData - { user_id, first_name, last_name, email, phone, address, city }
   * @param {Object} [connection=pool] - Active transaction connection, or the pool for standalone use
   * @returns {Promise<Object>} MySQL result object containing insertId, affectedRows, etc.
   */
  create: async (customerData, connection = pool) => {
    const { user_id, first_name, last_name, email, phone, address, city } = customerData;
    const query = `
      INSERT INTO customers (user_id, first_name, last_name, email, phone, address, city)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(query, [
      user_id ?? null,
      first_name,
      last_name,
      email,
      phone,
      address || null,
      city || null
    ]);
    return result;
  },

  /**
   * Fetches all customer records from the customers table.
   * @returns {Promise<Array>} Array of customer row objects.
   */
  findAll: async () => {
    const query = `
      SELECT customer_id, first_name, last_name, email, phone, address, city, created_at, updated_at
      FROM customers
      ORDER BY created_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  /**
   * Fetches a single customer record by customer_id. Includes user_id so
   * callers (e.g. deleteCustomer) can act on the linked users row.
   * @param {number} customer_id
   * @returns {Promise<Object|null>} Customer row, or null if not found.
   */
  findById: async (customer_id) => {
    const query = `
      SELECT customer_id, user_id, first_name, last_name, email, phone, address, city, created_at, updated_at
      FROM customers
      WHERE customer_id = ?
    `;
    const [rows] = await pool.query(query, [customer_id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Partially updates a customer record. Only columns present in `updates`
   * are written; the caller is responsible for whitelisting allowed fields.
   * @param {number} customer_id
   * @param {Object} updates - Plain object of column: value pairs to update
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  update: async (customer_id, updates) => {
    const fields = Object.keys(updates);
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => updates[field]);

    const query = `UPDATE customers SET ${setClause} WHERE customer_id = ?`;
    const [result] = await pool.execute(query, [...values, customer_id]);
    return result;
  }
};

module.exports = Customer;
