const { pool } = require('../config/db');

/**
 * ServiceBooking Model
 * Handles raw database operations for the 'service_bookings' table.
 */
const ServiceBooking = {
  /**
   * Inserts a new service booking record into the database.
   * @param {Object} bookingData - { customer_id, vehicle_id, service_date, service_type, service_status, remarks }
   * @returns {Promise<Object>} MySQL result object containing insertId, affectedRows, etc.
   */
  create: async (bookingData) => {
    const {
      customer_id,
      vehicle_id,
      service_date,
      service_type,
      service_status,
      remarks
    } = bookingData;

    const query = `
      INSERT INTO service_bookings (customer_id, vehicle_id, service_date, service_type, service_status, remarks)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      customer_id,
      vehicle_id,
      service_date,
      service_type,
      service_status || 'Pending',
      remarks || null
    ]);

    return result;
  },

  /**
   * Fetches all service booking records from the database.
   * @returns {Promise<Array>} Array of service booking row objects.
   */
  findAll: async () => {
    const query = `
      SELECT booking_id, customer_id, vehicle_id, service_date, service_type, service_status, remarks, created_at, updated_at
      FROM service_bookings
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.query(query);
    return rows;
  },

  /**
   * Fetches a single service booking record by booking_id.
   * @param {number} booking_id
   * @returns {Promise<Object|null>} Service booking row, or null if not found.
   */
  findById: async (booking_id) => {
    const query = `
      SELECT booking_id, customer_id, vehicle_id, service_date, service_type, service_status, remarks, created_at, updated_at
      FROM service_bookings
      WHERE booking_id = ?
    `;
    const [rows] = await pool.query(query, [booking_id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Partially updates a service booking record. Only columns present in
   * `updates` are written; the caller is responsible for whitelisting allowed fields.
   * @param {number} booking_id
   * @param {Object} updates - Plain object of column: value pairs to update
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  update: async (booking_id, updates) => {
    const fields = Object.keys(updates);
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => updates[field]);

    const query = `UPDATE service_bookings SET ${setClause} WHERE booking_id = ?`;
    const [result] = await pool.execute(query, [...values, booking_id]);
    return result;
  },

  /**
   * Deletes a service booking record by booking_id.
   * @param {number} booking_id
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  delete: async (booking_id) => {
    const query = `DELETE FROM service_bookings WHERE booking_id = ?`;
    const [result] = await pool.execute(query, [booking_id]);
    return result;
  }
};

module.exports = ServiceBooking;
