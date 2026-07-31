import apiClient from './api';

/**
 * Fetches all customer records (Admin, Sales Executive only).
 * @returns {Promise<Array>} Array of customer records
 */
export const getAllCustomers = async () => {
  const response = await apiClient.get('/customers');
  return response.data.data;
};
