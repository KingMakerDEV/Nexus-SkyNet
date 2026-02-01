import axios from 'axios';

// Base API instance for all requests
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', // ✅ removed /api
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, logging, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized - Please login again');
          break;
        case 403:
          console.error('Forbidden - Access denied');
          break;
        case 500:
          console.error('Server error - Please try again later');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.request) {
      console.error('Network error - Please check your connection');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
