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
  }
};

module.exports = Customer;
