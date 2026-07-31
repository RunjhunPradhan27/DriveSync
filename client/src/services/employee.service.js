import apiClient from './api';

/**
 * Fetches all employee records (Admin only).
 * @returns {Promise<Array>} Array of employee records
 */
export const getAllEmployees = async () => {
  const response = await apiClient.get('/employees');
  return response.data.data;
};
