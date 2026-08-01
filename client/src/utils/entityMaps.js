/**
 * Builds a vehicle_id -> "Make Model" lookup, used across list/form pages
 * that enrich a foreign-key id with a human-readable label.
 * @param {Array} vehicles
 * @returns {Map<number, string>}
 */
export const buildVehicleNameMap = (vehicles) =>
  new Map((vehicles || []).map((v) => [v.vehicle_id, `${v.make} ${v.model}`]));

/**
 * Builds a customer_id -> "First Last" lookup.
 * @param {Array} customers
 * @returns {Map<number, string>}
 */
export const buildCustomerNameMap = (customers) =>
  new Map((customers || []).map((c) => [c.customer_id, `${c.first_name} ${c.last_name}`]));

/**
 * Builds an employee_id -> "First Last" lookup.
 * @param {Array} employees
 * @returns {Map<number, string>}
 */
export const buildEmployeeNameMap = (employees) =>
  new Map((employees || []).map((e) => [e.employee_id, `${e.first_name} ${e.last_name}`]));
