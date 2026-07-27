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
  }
};

module.exports = Inventory;
