import apiClient from './api';

/**
 * Fetches all sales transaction records (Admin, Sales Executive only).
 * @returns {Promise<Array>} Array of sales records
 */
export const getAllSales = async () => {
  const response = await apiClient.get('/sales');
  return response.data.data;
};

/**
 * Fetches a single sale by sale_id (Admin, Sales Executive only).
 * @param {string|number} id
 * @returns {Promise<Object>} Sale record
 */
export const getSaleById = async (id) => {
  const response = await apiClient.get(`/sales/${id}`);
  return response.data.data;
};

/**
 * Creates a new sale transaction.
 * @param {Object} data - { customer_id, vehicle_id, employee_id, sale_date, sale_price, payment_method, sale_status }
 * @returns {Promise<Object>} Created sale record
 */
export const createSale = async (data) => {
  const response = await apiClient.post('/sales', data);
  return response.data.data;
};

/**
 * Partially updates a sale record.
 * @param {string|number} id
 * @param {Object} data - Any subset of the sale fields
 * @returns {Promise<Object>} { sale_id, ...updated fields }
 */
export const updateSale = async (id, data) => {
  const response = await apiClient.put(`/sales/${id}`, data);
  return response.data.data;
};

/**
 * Deletes a sale record.
 * @param {string|number} id
 */
export const deleteSale = async (id) => {
  await apiClient.delete(`/sales/${id}`);
};
