import apiClient from './api';

/**
 * Fetches all customer records (Admin, Sales Executive only).
 * @returns {Promise<Array>} Array of customer records
 */
export const getAllCustomers = async () => {
  const response = await apiClient.get('/customers');
  return response.data.data;
};

/**
 * Fetches a single customer by customer_id (Admin, Sales Executive only).
 * @param {string|number} id
 * @returns {Promise<Object>} Customer record
 */
export const getCustomerById = async (id) => {
  const response = await apiClient.get(`/customers/${id}`);
  return response.data.data;
};

/**
 * Creates a customer account (users + customers rows together, no JWT
 * returned since the caller is an Admin/Sales Executive, not the account owner).
 * @param {Object} data - { username, email, password, first_name, last_name, phone, address, city }
 * @returns {Promise<Object>} Created customer record
 */
export const createCustomer = async (data) => {
  const response = await apiClient.post('/customers', data);
  return response.data.data;
};

/**
 * Partially updates a customer's profile fields.
 * @param {string|number} id
 * @param {Object} data - Any subset of { first_name, last_name, phone, address, city }
 * @returns {Promise<Object>} { customer_id, ...updated fields }
 */
export const updateCustomer = async (id, data) => {
  const response = await apiClient.put(`/customers/${id}`, data);
  return response.data.data;
};

/**
 * Deletes a customer. May reject with a 409 if the customer has existing
 * sales records referencing them.
 * @param {string|number} id
 */
export const deleteCustomer = async (id) => {
  await apiClient.delete(`/customers/${id}`);
};
