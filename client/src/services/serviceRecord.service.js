import apiClient from './api';

/**
 * Fetches all service execution records (Admin, Technician only).
 * @returns {Promise<Array>} Array of service record entries
 */
export const getAllServiceRecords = async () => {
  const response = await apiClient.get('/service-records');
  return response.data.data;
};
