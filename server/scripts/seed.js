/**
 * Reusable demo-data seed script for DriveSync.
 *
 * Wipes and repopulates every business table with a small, internally
 * consistent dealership dataset — employees and customers (each with a
 * working login), vehicles, inventory, spare parts, service bookings,
 * service records, and sales — inserted in FK dependency order so
 * referential integrity holds throughout (every FK column points at a row
 * this same run actually created).
 *
 * Usage (from server/):
 *   npm run seed
 *
 * All demo accounts share one password, printed in the summary at the end
 * of the run (see DEMO_PASSWORD below).
 *
 * WARNING — destructive: this TRUNCATEs users, customers, employees,
 * vehicles, inventory, spare_parts, service_bookings, service_records, and
 * sales before reseeding. Never run this against a database whose data you
 * need to keep.
 */

const path = require('path');
// Same dual-source env loading as server.js, adjusted one directory deeper.
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const bcrypt = require('bcrypt');
const { pool } = require('../src/config/db');

const DEMO_PASSWORD = 'Demo@123';

// Children first so the TRUNCATEs read naturally top-to-bottom; the actual
// safety here comes from disabling FK checks around them, not this order.
const TABLES_TO_RESET = [
  'service_records',
  'service_bookings',
  'sales',
  'inventory',
  'spare_parts',
  'vehicles',
  'customers',
  'employees',
  'users'
];

const EMPLOYEES = [
  {
    username: 'ananya.kapoor',
    email: 'admin@drivesync.test',
    role: 'Admin',
    first_name: 'Ananya',
    last_name: 'Kapoor',
    phone: '9800000001',
    designation: 'Dealership Administrator',
    department: 'Administration',
    hire_date: '2021-01-10',
    salary: 95000
  },
  {
    username: 'rohan.mehta',
    email: 'rohan.mehta@drivesync.test',
    role: 'Sales Executive',
    first_name: 'Rohan',
    last_name: 'Mehta',
    phone: '9800000002',
    designation: 'Senior Sales Executive',
    department: 'Sales',
    hire_date: '2021-06-15',
    salary: 42000
  },
  {
    username: 'ishita.rao',
    email: 'ishita.rao@drivesync.test',
    role: 'Sales Executive',
    first_name: 'Ishita',
    last_name: 'Rao',
    phone: '9800000003',
    designation: 'Sales Executive',
    department: 'Sales',
    hire_date: '2023-02-01',
    salary: 36000
  },
  {
    username: 'vikram.singh',
    email: 'vikram.singh@drivesync.test',
    role: 'Technician',
    first_name: 'Vikram',
    last_name: 'Singh',
    phone: '9800000004',
    designation: 'Senior Technician',
    department: 'Service',
    hire_date: '2020-11-20',
    salary: 40000
  },
  {
    username: 'arjun.nair',
    email: 'arjun.nair@drivesync.test',
    role: 'Technician',
    first_name: 'Arjun',
    last_name: 'Nair',
    phone: '9800000005',
    designation: 'Technician',
    department: 'Service',
    hire_date: '2022-08-05',
    salary: 32000
  },
  {
    username: 'karan.bhatt',
    email: 'karan.bhatt@drivesync.test',
    role: 'Inventory Manager',
    first_name: 'Karan',
    last_name: 'Bhatt',
    phone: '9800000006',
    designation: 'Inventory Manager',
    department: 'Inventory',
    hire_date: '2021-09-12',
    salary: 45000
  }
];

const CUSTOMERS = [
  { username: 'riya.sharma', email: 'riya.sharma@drivesync.test', first_name: 'Riya', last_name: 'Sharma', phone: '9811100001', address: '221B MG Road', city: 'Bengaluru' },
  { username: 'aditya.verma', email: 'aditya.verma@drivesync.test', first_name: 'Aditya', last_name: 'Verma', phone: '9811100002', address: '14 Marine Drive', city: 'Mumbai' },
  { username: 'sneha.iyer', email: 'sneha.iyer@drivesync.test', first_name: 'Sneha', last_name: 'Iyer', phone: '9811100003', address: '45 Anna Salai', city: 'Chennai' },
  { username: 'farhan.khan', email: 'farhan.khan@drivesync.test', first_name: 'Farhan', last_name: 'Khan', phone: '9811100004', address: '12 Banjara Hills Road', city: 'Hyderabad' },
  { username: 'priya.nair', email: 'priya.nair@drivesync.test', first_name: 'Priya', last_name: 'Nair', phone: '9811100005', address: '9 Marine Drive', city: 'Kochi' },
  { username: 'deepak.joshi', email: 'deepak.joshi@drivesync.test', first_name: 'Deepak', last_name: 'Joshi', phone: '9811100006', address: '78 FC Road', city: 'Pune' },
  { username: 'meera.pillai', email: 'meera.pillai@drivesync.test', first_name: 'Meera', last_name: 'Pillai', phone: '9811100007', address: '33 Indiranagar 100ft Road', city: 'Bengaluru' },
  { username: 'sameer.kulkarni', email: 'sameer.kulkarni@drivesync.test', first_name: 'Sameer', last_name: 'Kulkarni', phone: '9811100008', address: '56 Connaught Place', city: 'Delhi' }
];

// status is decided up front per vehicle so every other table can reference
// it consistently (e.g. a "Sold" vehicle always lines up with a Completed
// sale row below, an "In_Maintenance" one with the in-progress booking).
const VEHICLES = [
  { make: 'Maruti Suzuki', model: 'Swift', model_year: 2025, color: 'Pearl White', fuel_type: 'Petrol', transmission: 'Manual', price: 650000, vin: 'MA3ERLF1SXX100001', status: 'Available' },
  { make: 'Maruti Suzuki', model: 'Baleno', model_year: 2025, color: 'Silver', fuel_type: 'Petrol', transmission: 'Automatic', price: 750000, vin: 'MA3EJKD1SXX100002', status: 'Available' },
  { make: 'Hyundai', model: 'Creta', model_year: 2026, color: 'Starlight Black', fuel_type: 'Diesel', transmission: 'Automatic', price: 1450000, vin: 'MALCM81CAXX100003', status: 'Sold' },
  { make: 'Hyundai', model: 'i20', model_year: 2024, color: 'Fiery Red', fuel_type: 'Petrol', transmission: 'Manual', price: 850000, vin: 'MALA851ALXX100004', status: 'Available' },
  { make: 'Tata', model: 'Nexon', model_year: 2025, color: 'Flame Red', fuel_type: 'Petrol', transmission: 'Manual', price: 950000, vin: 'MAT625125XX100005', status: 'Reserved' },
  { make: 'Tata', model: 'Nexon EV', model_year: 2026, color: 'Daytona Grey', fuel_type: 'Electric', transmission: 'Automatic', price: 1650000, vin: 'MAT625EVXX100006', status: 'Available' },
  { make: 'Mahindra', model: 'XUV700', model_year: 2025, color: 'Napoli Black', fuel_type: 'Diesel', transmission: 'Automatic', price: 2450000, vin: 'MA1XUV700XX100007', status: 'Sold' },
  { make: 'Mahindra', model: 'Scorpio-N', model_year: 2024, color: 'Deep Forest', fuel_type: 'Diesel', transmission: 'Manual', price: 1950000, vin: 'MA1SCORPNXX100008', status: 'In_Maintenance' },
  { make: 'Honda', model: 'City', model_year: 2026, color: 'Ivory White', fuel_type: 'Petrol', transmission: 'CVT', price: 1250000, vin: 'MHFCG5750XX100009', status: 'Available' },
  { make: 'Honda', model: 'Amaze', model_year: 2024, color: 'Golden Brown', fuel_type: 'Petrol', transmission: 'Manual', price: 850000, vin: 'MHFAMZ180XX100010', status: 'Sold' },
  { make: 'Toyota', model: 'Innova Crysta', model_year: 2025, color: 'Steel Grey', fuel_type: 'Diesel', transmission: 'Automatic', price: 2150000, vin: 'MHFINNCRXX100011', status: 'Available' },
  { make: 'Kia', model: 'Seltos', model_year: 2026, color: 'Gravity Grey', fuel_type: 'Petrol', transmission: 'Automatic', price: 1650000, vin: 'KNAKS812XX100012', status: 'Reserved' }
];

// Indexes into VEHICLES (0-based) that get a stock/inventory row — the Sold
// units and the one currently In_Maintenance are deliberately excluded,
// since inventory here tracks lot/showroom stock of a model, not a specific
// unit mid-sale or mid-service.
const INVENTORY = [
  { vehicleIndex: 0, quantity: 5, stock_status: 'In Stock', storage_location: 'Showroom Bay 1' },
  { vehicleIndex: 1, quantity: 3, stock_status: 'In Stock', storage_location: 'Showroom Bay 1' },
  { vehicleIndex: 3, quantity: 6, stock_status: 'In Stock', storage_location: 'Showroom Bay 2' },
  { vehicleIndex: 4, quantity: 1, stock_status: 'Low Stock', storage_location: 'Warehouse A' },
  { vehicleIndex: 5, quantity: 2, stock_status: 'Low Stock', storage_location: 'Showroom Bay 2' },
  { vehicleIndex: 8, quantity: 4, stock_status: 'In Stock', storage_location: 'Warehouse A' },
  { vehicleIndex: 10, quantity: 0, stock_status: 'Out of Stock', storage_location: 'Warehouse B' },
  { vehicleIndex: 11, quantity: 1, stock_status: 'Low Stock', storage_location: 'Warehouse B' }
];

const SPARE_PARTS = [
  { part_name: 'Brake Pad Set', part_number: 'BP-1001', quantity: 40, unit_price: 1450.00, supplier_name: 'Bosch' },
  { part_name: 'Engine Oil Filter', part_number: 'OF-2002', quantity: 65, unit_price: 320.00, supplier_name: 'Mann Filter' },
  { part_name: 'Air Filter', part_number: 'AF-3003', quantity: 50, unit_price: 480.00, supplier_name: 'Bosch' },
  { part_name: 'Clutch Plate', part_number: 'CP-4004', quantity: 15, unit_price: 2200.00, supplier_name: 'Exedy' },
  { part_name: 'Spark Plug Set', part_number: 'SP-5005', quantity: 55, unit_price: 650.00, supplier_name: 'NGK' },
  { part_name: 'Car Battery 35Ah', part_number: 'BAT-6006', quantity: 12, unit_price: 5200.00, supplier_name: 'Exide' },
  { part_name: 'Wiper Blade Set', part_number: 'WB-7007', quantity: 30, unit_price: 550.00, supplier_name: 'Bosch' },
  { part_name: 'Timing Belt', part_number: 'TB-8008', quantity: 8, unit_price: 1850.00, supplier_name: 'Gates' },
  { part_name: 'Radiator Coolant 1L', part_number: 'RC-9009', quantity: 45, unit_price: 380.00, supplier_name: 'Castrol' },
  { part_name: 'Shock Absorber', part_number: 'SA-1010', quantity: 3, unit_price: 3100.00, supplier_name: 'Monroe' }
];

async function resetTables(connection) {
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const table of TABLES_TO_RESET) {
    await connection.query(`TRUNCATE TABLE ${table}`);
  }
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');
}

async function insertUser(connection, passwordHash, { username, email, role }) {
  const [result] = await connection.execute(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, passwordHash, role]
  );
  return result.insertId;
}

async function seedEmployees(connection, passwordHash) {
  const employeeIds = {};
  for (const emp of EMPLOYEES) {
    const userId = await insertUser(connection, passwordHash, emp);
    const [result] = await connection.execute(
      `INSERT INTO employees (user_id, first_name, last_name, email, phone, designation, department, hire_date, salary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, emp.first_name, emp.last_name, emp.email, emp.phone, emp.designation, emp.department, emp.hire_date, emp.salary]
    );
    employeeIds[emp.username] = result.insertId;
  }
  return employeeIds;
}

async function seedCustomers(connection, passwordHash) {
  const customerIds = [];
  for (const cust of CUSTOMERS) {
    const userId = await insertUser(connection, passwordHash, { ...cust, role: 'Customer' });
    const [result] = await connection.execute(
      `INSERT INTO customers (user_id, first_name, last_name, email, phone, address, city)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, cust.first_name, cust.last_name, cust.email, cust.phone, cust.address, cust.city]
    );
    customerIds.push(result.insertId);
  }
  return customerIds;
}

async function seedVehicles(connection) {
  const vehicleIds = [];
  for (const v of VEHICLES) {
    const [result] = await connection.execute(
      `INSERT INTO vehicles (make, model, model_year, color, fuel_type, transmission, price, vin, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [v.make, v.model, v.model_year, v.color, v.fuel_type, v.transmission, v.price, v.vin, v.status]
    );
    vehicleIds.push(result.insertId);
  }
  return vehicleIds;
}

async function seedInventory(connection, vehicleIds) {
  for (const row of INVENTORY) {
    await connection.execute(
      `INSERT INTO inventory (vehicle_id, quantity, stock_status, storage_location) VALUES (?, ?, ?, ?)`,
      [vehicleIds[row.vehicleIndex], row.quantity, row.stock_status, row.storage_location]
    );
  }
}

async function seedSpareParts(connection) {
  for (const part of SPARE_PARTS) {
    await connection.execute(
      `INSERT INTO spare_parts (part_name, part_number, quantity, unit_price, supplier_name) VALUES (?, ?, ?, ?, ?)`,
      [part.part_name, part.part_number, part.quantity, part.unit_price, part.supplier_name]
    );
  }
}

async function seedServiceBookingsAndRecords(connection, customerIds, vehicleIds, employeeIds) {
  const technicianIds = [employeeIds['vikram.singh'], employeeIds['arjun.nair']];

  // [customerIndex, vehicleIndex, service_date, service_type, service_status, remarks]
  const bookings = [
    [0, 0, '2026-07-10', 'Oil Change', 'Completed', 'Routine oil and filter change'],
    [1, 3, '2026-07-14', 'Brake Inspection', 'Completed', 'Customer reported squeaking noise'],
    [2, 8, '2026-07-20', 'General Service', 'Completed', 'Full periodic maintenance'],
    [3, 7, '2026-07-30', 'Engine Diagnostics', 'In_Progress', 'Vehicle currently in the service bay'],
    [4, 10, '2026-08-10', 'Tyre Replacement', 'Pending', 'Customer requested all-season tyres'],
    [5, 5, '2026-08-15', 'Battery Health Check', 'Pending', null],
    [6, 1, '2026-07-22', 'AC Service', 'Cancelled', 'Customer rescheduled to a later date'],
    [0, 0, '2026-08-18', 'Wheel Alignment', 'Pending', null]
  ];

  const bookingIds = [];
  for (const [customerIndex, vehicleIndex, serviceDate, serviceType, status, remarks] of bookings) {
    const [result] = await connection.execute(
      `INSERT INTO service_bookings (customer_id, vehicle_id, service_date, service_type, service_status, remarks)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [customerIds[customerIndex], vehicleIds[vehicleIndex], serviceDate, serviceType, status, remarks]
    );
    bookingIds.push(result.insertId);
  }

  // Only the three Completed bookings (indexes 0-2) get a matching service
  // record — the in-progress, pending, and cancelled ones have no
  // completed work to log yet.
  const records = [
    { bookingIndex: 0, technicianId: technicianIds[1], work_description: 'Replaced engine oil and oil filter, topped up coolant', labour_cost: 400.00, parts_cost: 850.00, completion_date: '2026-07-10' },
    { bookingIndex: 1, technicianId: technicianIds[0], work_description: 'Inspected and replaced front brake pads', labour_cost: 600.00, parts_cost: 1450.00, completion_date: '2026-07-14' },
    { bookingIndex: 2, technicianId: technicianIds[0], work_description: 'Full service: oil change, filter replacement, multi-point inspection', labour_cost: 1200.00, parts_cost: 2100.00, completion_date: '2026-07-21' }
  ];

  for (const rec of records) {
    const totalCost = rec.labour_cost + rec.parts_cost;
    await connection.execute(
      `INSERT INTO service_records (booking_id, employee_id, work_description, labour_cost, parts_cost, total_cost, completion_date, service_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Completed')`,
      [bookingIds[rec.bookingIndex], rec.technicianId, rec.work_description, rec.labour_cost, rec.parts_cost, totalCost, rec.completion_date]
    );
  }
}

async function seedSales(connection, customerIds, vehicleIds, employeeIds) {
  const salesExecIds = [employeeIds['rohan.mehta'], employeeIds['ishita.rao']];

  // [customerIndex, vehicleIndex, employeeIndex(into salesExecIds), sale_date, sale_price, payment_method, sale_status]
  const sales = [
    [0, 2, 0, '2026-07-12', 1445000.00, 'Bank Transfer', 'Completed'],
    [1, 4, 1, '2026-07-28', 940000.00, 'Loan', 'Pending'],
    [2, 6, 0, '2026-07-18', 2430000.00, 'Bank Transfer', 'Completed'],
    [3, 9, 1, '2026-07-24', 845000.00, 'Card', 'Completed'],
    [4, 11, 0, '2026-07-29', 1645000.00, 'Loan', 'Pending'],
    [5, 1, 1, '2026-07-16', 745000.00, 'UPI', 'Cancelled']
  ];

  for (const [customerIndex, vehicleIndex, execIndex, saleDate, price, paymentMethod, status] of sales) {
    await connection.execute(
      `INSERT INTO sales (customer_id, vehicle_id, employee_id, sale_date, sale_price, payment_method, sale_status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customerIds[customerIndex], vehicleIds[vehicleIndex], salesExecIds[execIndex], saleDate, price, paymentMethod, status]
    );
  }
}

async function main() {
  const connection = await pool.getConnection();
  try {
    console.log('Resetting tables...');
    await resetTables(connection);

    console.log('Hashing demo password...');
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    await connection.beginTransaction();

    console.log('Seeding employees...');
    const employeeIds = await seedEmployees(connection, passwordHash);

    console.log('Seeding customers...');
    const customerIds = await seedCustomers(connection, passwordHash);

    console.log('Seeding vehicles...');
    const vehicleIds = await seedVehicles(connection);

    console.log('Seeding inventory...');
    await seedInventory(connection, vehicleIds);

    console.log('Seeding spare parts...');
    await seedSpareParts(connection);

    console.log('Seeding service bookings and records...');
    await seedServiceBookingsAndRecords(connection, customerIds, vehicleIds, employeeIds);

    console.log('Seeding sales...');
    await seedSales(connection, customerIds, vehicleIds, employeeIds);

    await connection.commit();

    console.log('\n✓ Demo dataset seeded successfully.\n');
    console.log(`All accounts share the password: ${DEMO_PASSWORD}\n`);
    console.log('Demo logins:');
    console.log('  Admin              admin@drivesync.test');
    console.log('  Sales Executive     rohan.mehta@drivesync.test / ishita.rao@drivesync.test');
    console.log('  Technician          vikram.singh@drivesync.test / arjun.nair@drivesync.test');
    console.log('  Inventory Manager   karan.bhatt@drivesync.test');
    console.log('  Customer            riya.sharma@drivesync.test (or any other customer email above)');
    console.log(`\nSeeded: ${EMPLOYEES.length} employees, ${CUSTOMERS.length} customers, ${VEHICLES.length} vehicles, ${INVENTORY.length} inventory records, ${SPARE_PARTS.length} spare parts, 8 service bookings, 3 service records, 6 sales.`);
  } catch (error) {
    await connection.rollback();
    console.error('Seeding failed, rolled back inserts (tables were already truncated):', error.message);
    process.exitCode = 1;
  } finally {
    connection.release();
    await pool.end();
  }
}

main();
