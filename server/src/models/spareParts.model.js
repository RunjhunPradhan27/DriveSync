const { pool } = require('../config/db');

/**
 * SparePart Model
 * Handles raw database operations for the 'spare_parts' table.
 */
const SparePart = {
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
  },

  /**
   * Fetches a single spare part record by part_id.
   * @param {number} part_id
   * @returns {Promise<Object|null>} Spare part row, or null if not found.
   */
  findById: async (part_id) => {
    const query = `
      SELECT part_id, part_name, part_number, quantity, unit_price, supplier_name, last_updated
      FROM spare_parts
      WHERE part_id = ?
    `;
    const [rows] = await pool.query(query, [part_id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Partially updates a spare part record. Only columns present in `updates`
   * are written; the caller is responsible for whitelisting allowed fields.
   * @param {number} part_id
   * @param {Object} updates - Plain object of column: value pairs to update
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  update: async (part_id, updates) => {
    const fields = Object.keys(updates);
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => updates[field]);

    const query = `UPDATE spare_parts SET ${setClause} WHERE part_id = ?`;
    const [result] = await pool.execute(query, [...values, part_id]);
    return result;
  },

  /**
   * Deletes a spare part record by part_id.
   * @param {number} part_id
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  delete: async (part_id) => {
    const query = `DELETE FROM spare_parts WHERE part_id = ?`;
    const [result] = await pool.execute(query, [part_id]);
    return result;
  }
};

module.exports = SparePart;
