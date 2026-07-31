import apiClient from './api';

/**
 * Authenticates a user against the existing login endpoint.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} JWT
 */
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data.token;
};
