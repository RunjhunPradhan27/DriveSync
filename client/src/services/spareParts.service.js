import apiClient from './api';

/**
 * Fetches all spare parts records (Admin, Inventory Manager, Technician).
 * @returns {Promise<Array>} Array of spare part records
 */
export const getAllSpareParts = async () => {
  const response = await apiClient.get('/spare-parts');
  return response.data.data;
};
