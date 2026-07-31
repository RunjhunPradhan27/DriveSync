const { pool } = require('../config/db');

/**
 * User Model
 * Handles raw database operations for the 'users' table.
 */
const User = {
  /**
   * Inserts a new user record into the database.
   * @param {Object} userData - { username, email, password, role }
   * @param {Object} [connection=pool] - Active transaction connection, or the pool for standalone use
   * @returns {Promise<Object>} MySQL result object containing insertId, affectedRows, etc.
   */
  create: async (userData, connection = pool) => {
    const { username, email, password, role } = userData;

    const query = `
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [username, email, password, role]);
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
  },

  /**
   * Deletes a user record by user_id. Because customers/employees hold a
   * NOT NULL UNIQUE FK to users with ON DELETE CASCADE, deleting the users
   * row is the correct way to remove a customer/employee account without
   * ever leaving an orphaned profile row behind.
   * @param {number} user_id - Primary key of the user to delete
   * @returns {Promise<Object>} MySQL result object containing affectedRows, etc.
   */
  deleteById: async (user_id) => {
    const query = `DELETE FROM users WHERE user_id = ?`;
    const [result] = await pool.execute(query, [user_id]);
    return result;
  }
};

module.exports = User;
