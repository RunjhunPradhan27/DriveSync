const { pool } = require('../config/db');

/**
 * ServiceRecord Model
 * Handles raw database operations for the 'service_records' table.
 */
const ServiceRecord = {
  /**
   * Inserts a new service record into the database.
   * @param {Object} recordData - { booking_id, employee_id, work_description, labour_cost, parts_cost, total_cost, completion_date, service_status }
   * @returns {Promise<Object>} MySQL result object containing insertId, affectedRows, etc.
   */
  create: async (recordData) => {
    const {
      booking_id,
      employee_id,
      work_description,
      labour_cost,
      parts_cost,
      total_cost,
      completion_date,
      service_status
    } = recordData;

    const query = `
      INSERT INTO service_records (booking_id, employee_id, work_description, labour_cost, parts_cost, total_cost, completion_date, service_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      booking_id,
      employee_id,
      work_description,
      labour_cost,
      parts_cost || 0.00,
      total_cost,
      completion_date,
      service_status || 'Completed'
    ]);

    return result;
  },

  /**
   * Fetches all service records from the database.
   * @returns {Promise<Array>} Array of service record row objects.
   */
  findAll: async () => {
    const query = `
      SELECT record_id, booking_id, employee_id, work_description, labour_cost, parts_cost, total_cost, completion_date, service_status, created_at, updated_at
      FROM service_records
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.query(query);
    return rows;
  }
};

module.exports = ServiceRecord;
