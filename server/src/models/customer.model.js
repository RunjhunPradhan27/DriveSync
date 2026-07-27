const { pool } = require('../config/db');

/**
 * Customer Model
 * Handles raw database operations for the 'customers' table.
 */
const Customer = {
  /**
   * Inserts a new customer record into the customers table.
   * @param {Object} customerData - { first_name, last_name, email, phone, address, city }
   * @returns {Promise<Object>} MySQL result object containing insertId, affectedRows, etc.
   */
  create: async (customerData) => {
    const { first_name, last_name, email, phone, address, city } = customerData;
    const query = `
      INSERT INTO customers (first_name, last_name, email, phone, address, city)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
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
