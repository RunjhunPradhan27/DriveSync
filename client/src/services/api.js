import axios from 'axios';
import { getToken, clearToken } from '../utils/tokenStorage.js';

// Defaults to the relative '/api' path, which the Vite dev-server proxy
// forwards to the backend (see vite.config.js) — no CORS setup needed.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attaches the stored JWT (if any) to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If a request that carried a token comes back 401, the token is invalid or
// expired server-side — clear it and send the user to /login. Requests that
// never carried a token (e.g. the login call itself) are left alone so the
// caller can show its own "invalid credentials" message instead of being
// redirected mid-login-attempt.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hadAuthHeader = Boolean(error.config?.headers?.Authorization);

    if (status === 401 && hadAuthHeader) {
      clearToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
