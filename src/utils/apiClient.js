import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Add token to headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user_role');
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export const authClient = axios.create({
  baseURL: API_URL,
});

export default apiClient;
