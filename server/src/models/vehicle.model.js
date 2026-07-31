const { pool } = require('../config/db');

/**
 * Vehicle Model
 * Handles raw database operations for the 'vehicles' table.
 */
const Vehicle = {
  /**
   * Inserts a new vehicle record into the vehicles table.
   * @param {Object} vehicleData - { make, model, model_year, color, fuel_type, transmission, price, vin, status }
   * @returns {Promise<Object>} MySQL result object containing insertId, affectedRows, etc.
   */
  create: async (vehicleData) => {
    const {
      make,
      model,
      model_year,
      color,
      fuel_type,
      transmission,
      price,
      vin,
      status
    } = vehicleData;

    const query = `
      INSERT INTO vehicles (make, model, model_year, color, fuel_type, transmission, price, vin, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      make,
      model,
      model_year,
      color || null,
      fuel_type,
      transmission,
      price,
      vin,
      status || 'Available'
    ]);

    return result;
  },

  /**
   * Fetches all vehicle records from the vehicles table.
   * @returns {Promise<Array>} Array of vehicle row objects.
   */
  findAll: async () => {
    const query = `
      SELECT vehicle_id, make, model, model_year, color, fuel_type, transmission, price, vin, status, created_at, updated_at
      FROM vehicles
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.query(query);
    return rows;
  },

  /**
   * Fetches a single vehicle record by vehicle_id.
   * @param {number} vehicle_id
   * @returns {Promise<Object|null>} Vehicle row, or null if not found.
   */
  findById: async (vehicle_id) => {
    const query = `
      SELECT vehicle_id, make, model, model_year, color, fuel_type, transmission, price, vin, status, created_at, updated_at
      FROM vehicles
      WHERE vehicle_id = ?
    `;
    const [rows] = await pool.query(query, [vehicle_id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Partially updates a vehicle record. Only columns present in `updates`
   * are written; the caller is responsible for whitelisting allowed fields.
   * @param {number} vehicle_id
   * @param {Object} updates - Plain object of column: value pairs to update
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  update: async (vehicle_id, updates) => {
    const fields = Object.keys(updates);
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => updates[field]);

    const query = `UPDATE vehicles SET ${setClause} WHERE vehicle_id = ?`;
    const [result] = await pool.execute(query, [...values, vehicle_id]);
    return result;
  },

  /**
   * Deletes a vehicle record by vehicle_id.
   * @param {number} vehicle_id
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  delete: async (vehicle_id) => {
    const query = `DELETE FROM vehicles WHERE vehicle_id = ?`;
    const [result] = await pool.execute(query, [vehicle_id]);
    return result;
  }
};

module.exports = Vehicle;
