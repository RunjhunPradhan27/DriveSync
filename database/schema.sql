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
