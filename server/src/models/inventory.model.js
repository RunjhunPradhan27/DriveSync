const { pool } = require('../config/db');

/**
 * Inventory Model
 * Handles raw database operations for the 'inventory' table.
 */
const Inventory = {
  /**
   * Inserts a new inventory record into the database.
   * @param {Object} inventoryData - { vehicle_id, quantity, stock_status, storage_location }
   * @returns {Promise<Object>} MySQL result object containing insertId, affectedRows, etc.
   */
  create: async (inventoryData) => {
    const { vehicle_id, quantity, stock_status, storage_location } = inventoryData;

    const query = `
      INSERT INTO inventory (vehicle_id, quantity, stock_status, storage_location)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      vehicle_id,
      quantity !== undefined ? quantity : 0,
      stock_status || 'In Stock',
      storage_location
    ]);

    return result;
  },

  /**
   * Fetches all inventory records from the database.
   * @returns {Promise<Array>} Array of inventory row objects.
   */
  findAll: async () => {
    const query = `
      SELECT inventory_id, vehicle_id, quantity, stock_status, storage_location, last_updated
      FROM inventory
      ORDER BY last_updated DESC
    `;

    const [rows] = await pool.query(query);
    return rows;
  },

  /**
   * Fetches a single inventory record by inventory_id.
   * @param {number} inventory_id
   * @returns {Promise<Object|null>} Inventory row, or null if not found.
   */
  findById: async (inventory_id) => {
    const query = `
      SELECT inventory_id, vehicle_id, quantity, stock_status, storage_location, last_updated
      FROM inventory
      WHERE inventory_id = ?
    `;
    const [rows] = await pool.query(query, [inventory_id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Partially updates an inventory record. Only columns present in `updates`
   * are written; the caller is responsible for whitelisting allowed fields.
   * @param {number} inventory_id
   * @param {Object} updates - Plain object of column: value pairs to update
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  update: async (inventory_id, updates) => {
    const fields = Object.keys(updates);
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => updates[field]);

    const query = `UPDATE inventory SET ${setClause} WHERE inventory_id = ?`;
    const [result] = await pool.execute(query, [...values, inventory_id]);
    return result;
  },

  /**
   * Deletes an inventory record by inventory_id.
   * @param {number} inventory_id
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  delete: async (inventory_id) => {
    const query = `DELETE FROM inventory WHERE inventory_id = ?`;
    const [result] = await pool.execute(query, [inventory_id]);
    return result;
  }
};

module.exports = Inventory;
