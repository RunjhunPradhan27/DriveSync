import apiClient from './api';

/**
 * Fetches all sales transaction records (Admin, Sales Executive only).
 * @returns {Promise<Array>} Array of sales records
 */
export const getAllSales = async () => {
  const response = await apiClient.get('/sales');
  return response.data.data;
};
