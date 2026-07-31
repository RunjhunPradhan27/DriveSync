import apiClient from './api';

/**
 * Fetches all service booking records (Admin, Technician, Sales Executive).
 * @returns {Promise<Array>} Array of service booking records
 */
export const getAllServiceBookings = async () => {
  const response = await apiClient.get('/service-bookings');
  return response.data.data;
};
