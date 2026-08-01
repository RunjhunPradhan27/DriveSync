import apiClient from './api';

/**
 * Fetches all service execution records (Admin, Technician only).
 * @returns {Promise<Array>} Array of service record entries
 */
export const getAllServiceRecords = async () => {
  const response = await apiClient.get('/service-records');
  return response.data.data;
};

/**
 * Fetches a single service record by record_id (Admin, Technician only).
 * @param {string|number} id
 * @returns {Promise<Object>} Service record entry
 */
export const getServiceRecordById = async (id) => {
  const response = await apiClient.get(`/service-records/${id}`);
  return response.data.data;
};

/**
 * Creates a new service record.
 * @param {Object} data - { booking_id, employee_id, work_description, labour_cost, parts_cost, total_cost, completion_date, service_status }
 * @returns {Promise<Object>} Created service record entry
 */
export const createServiceRecord = async (data) => {
  const response = await apiClient.post('/service-records', data);
  return response.data.data;
};

/**
 * Partially updates a service record.
 * @param {string|number} id
 * @param {Object} data - Any subset of the service record fields
 * @returns {Promise<Object>} { record_id, ...updated fields }
 */
export const updateServiceRecord = async (id, data) => {
  const response = await apiClient.put(`/service-records/${id}`, data);
  return response.data.data;
};

/**
 * Deletes a service record.
 * @param {string|number} id
 */
export const deleteServiceRecord = async (id) => {
  await apiClient.delete(`/service-records/${id}`);
};
