const { pool } = require('../config/db');

/**
 * User Model
 * Handles raw database operations for the 'users' table.
 */
const User = {
  /**
   * Inserts a new user record into the database.
   * @param {Object} userData - { username, email, password, role }
   * @returns {Promise<Object>} MySQL result object containing insertId, affectedRows, etc.
   */
  create: async (userData) => {
    const { username, email, password, role } = userData;

    const query = `
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [username, email, password, role]);
    return result;
  },

  /**
   * Fetches a single user record by email address.
   * @param {string} email - Email address to search for
   * @returns {Promise<Object|null>} User object if found, or null if no user matches
   */
  findByEmail: async (email) => {
    const query = `
      SELECT * FROM users
      WHERE email = ?
    `;

    const [rows] = await pool.execute(query, [email]);
    return rows.length > 0 ? rows[0] : null;
  }
};

module.exports = User;
