import axios from 'axios';

// Defaults to the relative '/api' path, which the Vite dev-server proxy
// forwards to the backend (see vite.config.js) — no CORS setup needed.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
