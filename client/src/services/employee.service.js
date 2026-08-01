import apiClient from './api';

/**
 * Fetches all employee records (Admin only).
 * @returns {Promise<Array>} Array of employee records
 */
export const getAllEmployees = async () => {
  const response = await apiClient.get('/employees');
  return response.data.data;
};

/**
 * Fetches a single employee by employee_id (Admin only).
 * @param {string|number} id
 * @returns {Promise<Object>} Employee record
 */
export const getEmployeeById = async (id) => {
  const response = await apiClient.get(`/employees/${id}`);
  return response.data.data;
};

/**
 * Creates a new employee account (users + employees rows together).
 * @param {Object} data - { username, email, password, role, first_name, last_name, phone, designation, department, hire_date, salary }
 * @returns {Promise<Object>} Created employee record
 */
export const createEmployee = async (data) => {
  const response = await apiClient.post('/employees', data);
  return response.data.data;
};

/**
 * Partially updates an employee's profile fields.
 * @param {string|number} id
 * @param {Object} data - Any subset of { first_name, last_name, phone, designation, department, hire_date, salary }
 * @returns {Promise<Object>} { employee_id, ...updated fields }
 */
export const updateEmployee = async (id, data) => {
  const response = await apiClient.put(`/employees/${id}`, data);
  return response.data.data;
};

/**
 * Deletes an employee (via the linked users row). May reject with a 409 if
 * the employee has existing sales or service records referencing them.
 * @param {string|number} id
 */
export const deleteEmployee = async (id) => {
  await apiClient.delete(`/employees/${id}`);
};
