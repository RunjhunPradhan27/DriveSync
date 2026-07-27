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
  }
};

module.exports = ServiceBooking;
