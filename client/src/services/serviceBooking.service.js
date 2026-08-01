import apiClient from './api';

/**
 * Fetches all service booking records (Admin, Technician, Sales Executive).
 * @returns {Promise<Array>} Array of service booking records
 */
export const getAllServiceBookings = async () => {
  const response = await apiClient.get('/service-bookings');
  return response.data.data;
};

/**
 * Fetches a single service booking by booking_id (Admin, Technician, Sales Executive).
 * @param {string|number} id
 * @returns {Promise<Object>} Service booking record
 */
export const getServiceBookingById = async (id) => {
  const response = await apiClient.get(`/service-bookings/${id}`);
  return response.data.data;
};

/**
 * Creates a new service booking appointment.
 * @param {Object} data - { customer_id, vehicle_id, service_date, service_type, service_status, remarks }
 * @returns {Promise<Object>} Created service booking record
 */
export const createServiceBooking = async (data) => {
  const response = await apiClient.post('/service-bookings', data);
  return response.data.data;
};

/**
 * Partially updates a service booking record.
 * @param {string|number} id
 * @param {Object} data - Any subset of the service booking fields
 * @returns {Promise<Object>} { booking_id, ...updated fields }
 */
export const updateServiceBooking = async (id, data) => {
  const response = await apiClient.put(`/service-bookings/${id}`, data);
  return response.data.data;
};

/**
 * Deletes a service booking record.
 * @param {string|number} id
 */
export const deleteServiceBooking = async (id) => {
  await apiClient.delete(`/service-bookings/${id}`);
};
