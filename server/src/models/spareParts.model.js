const { pool } = require('../config/db');

/**
 * SpareParts Model
 * Handles raw database operations for the 'spare_parts' table.
 */
const SpareParts = {
  /**
   * Inserts a new spare part into the database.
   * @param {Object} partData - { part_name, part_number, quantity, unit_price, supplier_name }
   * @returns {Promise<Object>} MySQL result object containing insertId, affectedRows, etc.
   */
  create: async (partData) => {
    const { part_name, part_number, quantity, unit_price, supplier_name } = partData;

    const query = `
      INSERT INTO spare_parts (part_name, part_number, quantity, unit_price, supplier_name)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      part_name,
      part_number,
      quantity !== undefined ? quantity : 0,
      unit_price,
      supplier_name
    ]);

    return result;
  },

  /**
   * Fetches all spare parts from the database.
   * @returns {Promise<Array>} Array of spare parts row objects.
   */
  findAll: async () => {
    const query = `
      SELECT part_id, part_name, part_number, quantity, unit_price, supplier_name, last_updated
      FROM spare_parts
      ORDER BY last_updated DESC
    `;

    const [rows] = await pool.query(query);
    return rows;
  }
};

module.exports = SpareParts;
