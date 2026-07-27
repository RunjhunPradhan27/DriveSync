const path = require('path');
// Load environment variables from root .env or current working directory
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const app = require('./src/app');
const { testConnection } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Initialize & verify database connection before starting HTTP server
    await testConnection();

    app.listen(PORT, () => {
      console.log(`DriveSync Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Exiting application gracefully...');
    process.exit(1);
  }
};

startServer();
