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
  }
};

module.exports = Sales;
