import apiClient from './api';

/**
 * Fetches all spare parts records (Admin, Inventory Manager, Technician).
 * @returns {Promise<Array>} Array of spare part records
 */
export const getAllSpareParts = async () => {
  const response = await apiClient.get('/spare-parts');
  return response.data.data;
};

/**
 * Fetches a single spare part by part_id (Admin, Inventory Manager, Technician).
 * @param {string|number} id
 * @returns {Promise<Object>} Spare part record
 */
export const getSparePartById = async (id) => {
  const response = await apiClient.get(`/spare-parts/${id}`);
  return response.data.data;
};

/**
 * Creates a new spare part.
 * @param {Object} data - { part_name, part_number, quantity, unit_price, supplier_name }
 * @returns {Promise<Object>} Created spare part record
 */
export const createSparePart = async (data) => {
  const response = await apiClient.post('/spare-parts', data);
  return response.data.data;
};

/**
 * Partially updates a spare part record.
 * @param {string|number} id
 * @param {Object} data - Any subset of the spare part fields
 * @returns {Promise<Object>} { part_id, ...updated fields }
 */
export const updateSparePart = async (id, data) => {
  const response = await apiClient.put(`/spare-parts/${id}`, data);
  return response.data.data;
};

/**
 * Deletes a spare part record.
 * @param {string|number} id
 */
export const deleteSparePart = async (id) => {
  await apiClient.delete(`/spare-parts/${id}`);
};
