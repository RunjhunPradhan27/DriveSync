-- =============================================================================
-- DriveSync Database Schema
-- Table: customers
-- Description: Stores customer profiles, contact information, and audit timestamps.
-- =============================================================================

CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique auto-incremented identifier for each customer',
    first_name VARCHAR(50) NOT NULL COMMENT 'Customer given name',
    last_name VARCHAR(50) NOT NULL COMMENT 'Customer surname/family name',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Unique contact email address used for communication',
    phone VARCHAR(20) NOT NULL UNIQUE COMMENT 'Unique contact telephone/mobile number',
    address TEXT NULL COMMENT 'Full postal residential/business address',
    city VARCHAR(100) NULL COMMENT 'City of residence',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when customer record was created',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when customer record was last updated'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table storing dealership customer records';

-- =============================================================================
-- Table: employees
-- Description: Stores employee records, designations, departments, and payroll details.
-- =============================================================================

CREATE TABLE IF NOT EXISTS employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique auto-incremented identifier for each employee',
    first_name VARCHAR(50) NOT NULL COMMENT 'Employee given name',
    last_name VARCHAR(50) NOT NULL COMMENT 'Employee surname/family name',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Unique official email address for staff member',
    phone VARCHAR(20) NOT NULL UNIQUE COMMENT 'Unique contact telephone/mobile number',
    designation VARCHAR(50) NOT NULL COMMENT 'Job title (e.g. Sales Executive, Technician, Manager)',
    department VARCHAR(50) NOT NULL COMMENT 'Dealership department (e.g. Sales, Service, Inventory, Admin)',
    hire_date DATE NOT NULL COMMENT 'Official date of employment joining',
    salary DECIMAL(10, 2) NOT NULL COMMENT 'Monthly/Annual compensation amount',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when employee record was created',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when employee record was last updated'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table storing dealership staff records';

-- =============================================================================
-- Table: vehicles
-- Description: Stores vehicle inventory catalog, specifications, pricing, and availability.
-- =============================================================================

CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique auto-incremented identifier for each vehicle',
    make VARCHAR(100) NOT NULL COMMENT 'Manufacturer brand name (e.g. Toyota, Honda, BMW)',
    model VARCHAR(100) NOT NULL COMMENT 'Specific vehicle model name (e.g. Camry, Civic, X5)',
    model_year YEAR NOT NULL COMMENT 'Manufacturing model year',
    color VARCHAR(50) NULL COMMENT 'Exterior paint color',
    fuel_type VARCHAR(30) NOT NULL COMMENT 'Engine fuel system (e.g. Petrol, Diesel, Electric, Hybrid)',
    transmission VARCHAR(30) NOT NULL COMMENT 'Gearbox type (e.g. Automatic, Manual, CVT)',
    price DECIMAL(12, 2) NOT NULL COMMENT 'Selling price amount',
    vin VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique 17-character Vehicle Identification Number',
    status VARCHAR(30) NOT NULL DEFAULT 'Available' COMMENT 'Inventory status (Available, Reserved, Sold, In_Maintenance)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when vehicle record was created',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when vehicle record was last updated'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table storing dealership vehicle inventory';

-- =============================================================================
-- Table: service_bookings
-- Description: Stores vehicle service appointments, maintenance types, status, and customer links.
-- =============================================================================

CREATE TABLE IF NOT EXISTS service_bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique auto-incremented identifier for each service booking',
    customer_id INT NOT NULL COMMENT 'Foreign key referencing customers(customer_id)',
    vehicle_id INT NOT NULL COMMENT 'Foreign key referencing vehicles(vehicle_id)',
    service_date DATE NOT NULL COMMENT 'Scheduled date for the vehicle service',
    service_type VARCHAR(100) NOT NULL COMMENT 'Type of maintenance (e.g. Oil Change, Brake Inspection, General Service)',
    service_status VARCHAR(30) NOT NULL DEFAULT 'Pending' COMMENT 'Current booking status (Pending, In_Progress, Completed, Cancelled)',
    remarks TEXT NULL COMMENT 'Additional customer instructions or technician service notes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when booking record was created',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when booking record was last updated',
    CONSTRAINT fk_service_bookings_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_service_bookings_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table storing vehicle service appointments';

-- =============================================================================
-- Table: service_records
-- Description: Stores completed/cancelled vehicle service job logs, labor/parts billing, and assigned technicians.
-- =============================================================================

CREATE TABLE IF NOT EXISTS service_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique auto-incremented identifier for each service record',
    booking_id INT NOT NULL COMMENT 'Foreign key referencing service_bookings(booking_id)',
    employee_id INT NOT NULL COMMENT 'Foreign key referencing employees(employee_id) for the servicing technician',
    work_description TEXT NOT NULL COMMENT 'Detailed breakdown of maintenance/repairs performed',
    labour_cost DECIMAL(10, 2) NOT NULL COMMENT 'Cost of labor charged for the service work',
    parts_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Cost of replacement parts used in the service',
    total_cost DECIMAL(10, 2) NOT NULL COMMENT 'Sum of labor cost and parts cost',
    completion_date DATE NOT NULL COMMENT 'Date when the service work was completed',
    service_status ENUM('Completed', 'Cancelled') NOT NULL DEFAULT 'Completed' COMMENT 'Final completion status of the service job',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when service record was created',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when service record was last updated',
    CONSTRAINT fk_service_records_booking FOREIGN KEY (booking_id) REFERENCES service_bookings(booking_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_service_records_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table storing completed vehicle service maintenance job logs';

-- =============================================================================
-- Table: sales
-- Description: Stores completed/pending vehicle sales transactions, pricing, payment methods, and sales rep assignments.
-- =============================================================================

CREATE TABLE IF NOT EXISTS sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique auto-incremented identifier for each sale transaction',
    customer_id INT NOT NULL COMMENT 'Foreign key referencing customers(customer_id)',
    vehicle_id INT NOT NULL COMMENT 'Foreign key referencing vehicles(vehicle_id)',
    employee_id INT NOT NULL COMMENT 'Foreign key referencing employees(employee_id) for the sales executive',
    sale_date DATE NOT NULL COMMENT 'Official transaction sale date',
    sale_price DECIMAL(12, 2) NOT NULL COMMENT 'Final agreed vehicle selling price',
    payment_method ENUM('Cash', 'Card', 'UPI', 'Bank Transfer', 'Loan') NOT NULL COMMENT 'Payment mode used for the purchase',
    sale_status ENUM('Pending', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending' COMMENT 'Transaction status (Pending, Completed, Cancelled)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when sale record was created',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when sale record was last updated',
    CONSTRAINT fk_sales_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sales_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sales_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table storing vehicle sales transaction records';

-- =============================================================================
-- Table: inventory
-- Description: Tracks vehicle stock quantity, stock status, and storage warehouse/lot locations.
-- =============================================================================

CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique auto-incremented identifier for each inventory record',
    vehicle_id INT NOT NULL COMMENT 'Foreign key referencing vehicles(vehicle_id)',
    quantity INT NOT NULL DEFAULT 0 COMMENT 'Available stock quantity for the vehicle model',
    stock_status ENUM('In Stock', 'Low Stock', 'Out of Stock') NOT NULL DEFAULT 'In Stock' COMMENT 'Current stock availability level',
    storage_location VARCHAR(100) NOT NULL COMMENT 'Physical lot, warehouse, or showroom location',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when inventory record was last updated',
    CONSTRAINT fk_inventory_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table storing dealership vehicle stock inventory';
