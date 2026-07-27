const express = require('express');
const healthRoutes = require('./routes/health.routes');
const customerRoutes = require('./routes/customer.routes');
const employeeRoutes = require('./routes/employee.routes');

const app = express();

// Middleware to parse incoming JSON payloads (must be registered before routes)
app.use(express.json());

// Register application feature routes
app.use('/health', healthRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);

module.exports = app;