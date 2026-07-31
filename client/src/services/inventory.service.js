import apiClient from './api';

/**
 * Fetches all inventory stock records (Admin, Inventory Manager only).
 * @returns {Promise<Array>} Array of inventory records
 */
export const getAllInventory = async () => {
  const response = await apiClient.get('/inventory');
  return response.data.data;
};
