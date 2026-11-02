import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: Attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('renthub_user');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (e) {
        console.error('Error parsing stored user data', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract error messages cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or unauthorized, clear storage if on a protected route
    if (error.response && error.response.status === 401) {
      const isAuthRoute = window.location.pathname.includes('/dashboard') || window.location.pathname.includes('/admin');
      if (isAuthRoute) {
        localStorage.removeItem('renthub_user');
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

