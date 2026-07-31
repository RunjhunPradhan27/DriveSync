import apiClient from './api';

/**
 * Fetches all inventory stock records (Admin, Inventory Manager only).
 * @returns {Promise<Array>} Array of inventory records
 */
export const getAllInventory = async () => {
  const response = await apiClient.get('/inventory');
  return response.data.data;
};

/**
 * Fetches a single inventory record by inventory_id (Admin, Inventory Manager only).
 * @param {string|number} id
 * @returns {Promise<Object>} Inventory record
 */
export const getInventoryById = async (id) => {
  const response = await apiClient.get(`/inventory/${id}`);
  return response.data.data;
};

/**
 * Creates a new inventory stock record.
 * @param {Object} data - { vehicle_id, quantity, stock_status, storage_location }
 * @returns {Promise<Object>} Created inventory record
 */
export const createInventory = async (data) => {
  const response = await apiClient.post('/inventory', data);
  return response.data.data;
};

/**
 * Partially updates an inventory record.
 * @param {string|number} id
 * @param {Object} data - Any subset of the inventory fields
 * @returns {Promise<Object>} { inventory_id, ...updated fields }
 */
export const updateInventory = async (id, data) => {
  const response = await apiClient.put(`/inventory/${id}`, data);
  return response.data.data;
};

/**
 * Deletes an inventory record.
 * @param {string|number} id
 */
export const deleteInventory = async (id) => {
  await apiClient.delete(`/inventory/${id}`);
};
