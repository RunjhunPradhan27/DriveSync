const mysql = require('mysql2/promise');

// Create a reusable MySQL connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Without this, mysql2 converts DATE/DATETIME/TIMESTAMP columns to JS Date
  // objects using the server process's local timezone, then serializes them
  // back to UTC via JSON.stringify — shifting any DATE column (which has no
  // time component, so it's parsed at local midnight) to the previous day
  // whenever the process runs in a timezone ahead of UTC. Every call site in
  // this codebase already treats these fields as plain strings, so returning
  // MySQL's native "YYYY-MM-DD[ HH:MM:SS]" text directly is a strictly
  // correct fix with no downstream changes needed.
  dateStrings: true
});

/**
 * Tests database connectivity on application startup
 */
const testConnection = async () => {
  const connection = await pool.getConnection();
  console.log('Successfully connected to MySQL Database.');
  connection.release();
};

module.exports = {
  pool,
  testConnection
};
