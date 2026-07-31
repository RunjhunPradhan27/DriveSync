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
  },

  /**
   * Fetches a single service record by record_id.
   * @param {number} record_id
   * @returns {Promise<Object|null>} Service record row, or null if not found.
   */
  findById: async (record_id) => {
    const query = `
      SELECT record_id, booking_id, employee_id, work_description, labour_cost, parts_cost, total_cost, completion_date, service_status, created_at, updated_at
      FROM service_records
      WHERE record_id = ?
    `;
    const [rows] = await pool.query(query, [record_id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Partially updates a service record. Only columns present in `updates`
   * are written; the caller is responsible for whitelisting allowed fields.
   * @param {number} record_id
   * @param {Object} updates - Plain object of column: value pairs to update
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  update: async (record_id, updates) => {
    const fields = Object.keys(updates);
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => updates[field]);

    const query = `UPDATE service_records SET ${setClause} WHERE record_id = ?`;
    const [result] = await pool.execute(query, [...values, record_id]);
    return result;
  },

  /**
   * Deletes a service record by record_id.
   * @param {number} record_id
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  delete: async (record_id) => {
    const query = `DELETE FROM service_records WHERE record_id = ?`;
    const [result] = await pool.execute(query, [record_id]);
    return result;
  }
};

module.exports = ServiceRecord;
