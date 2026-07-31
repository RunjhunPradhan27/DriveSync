import apiClient from './api';

/**
 * Fetches all vehicles from the public vehicle catalog.
 * @returns {Promise<Array>} Array of vehicle records
 */
export const getAllVehicles = async () => {
  const response = await apiClient.get('/vehicles');
  return response.data.data;
};

/**
 * Fetches a single vehicle by vehicle_id.
 * @param {string|number} id
 * @returns {Promise<Object>} Vehicle record
 */
export const getVehicleById = async (id) => {
  const response = await apiClient.get(`/vehicles/${id}`);
  return response.data.data;
};
