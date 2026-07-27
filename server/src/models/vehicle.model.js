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
  }
};

module.exports = Vehicle;
