const express = require('express');
const healthRoutes = require('./routes/health.routes');
const customerRoutes = require('./routes/customer.routes');
const employeeRoutes = require('./routes/employee.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const serviceBookingRoutes = require('./routes/serviceBooking.routes');
const serviceRecordRoutes = require('./routes/serviceRecord.routes');
const salesRoutes = require('./routes/sales.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const sparePartsRoutes = require('./routes/spareParts.routes');

const app = express();

// Middleware to parse incoming JSON payloads (must be registered before routes)
app.use(express.json());

// Register application feature routes
app.use('/health', healthRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/service-bookings', serviceBookingRoutes);
app.use('/api/service-records', serviceRecordRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/spare-parts', sparePartsRoutes);

module.exports = app;