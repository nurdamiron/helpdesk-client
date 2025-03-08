// src/api/index.js
import axios from 'axios';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL); // Debug

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 15000, // 15 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // Create a custom error object with useful information
        const customError = {
            status: error.response?.status || 0,
            message: error.response?.data?.error || error.message,
            data: error.response?.data || null,
            url: error.config?.url || '',
        };
        
        // Log error for debugging
        console.error('API Error:', customError);
        
        // Custom handling for network errors
        if (!error.response) {
            customError.message = 'Сервер недоступен. Проверьте подключение к интернету или повторите попытку позже.';
            customError.isNetworkError = true;
        }
        
        return Promise.reject(customError);
    }
);

// API service methods
const apiService = {
    get: (endpoint, params = {}) => api.get(endpoint, { params }),
    post: (endpoint, data = {}) => api.post(endpoint, data),
    put: (endpoint, data = {}) => api.put(endpoint, data),
    patch: (endpoint, data = {}) => api.patch(endpoint, data),
    delete: (endpoint) => api.delete(endpoint),
    
    // API health check with better error handling
    checkApiHealth: async () => {
        try {
          console.log('Checking API health at:', `${API_URL.replace(/\/api\/?$/, '')}/health`);
          const response = await axios.get(`${API_URL.replace(/\/api\/?$/, '')}/health`, {
            timeout: 5000 // Short timeout for health check
          });
          console.log('Health check response:', response.data);
          return { isHealthy: true, data: response.data };
        } catch (error) {
          console.error('API Health Check Failed:', error.message);
          console.error('Detailed error:', error);
          return { 
            isHealthy: false, 
            error: {
              message: error.message,
              isNetworkError: !error.response
            }
          };
        }
      },
    
    // Method to initialize API
    init: async () => {
        console.log('API Client initialized with URL:', API_URL);
        const healthStatus = await apiService.checkApiHealth();
        
        if (!healthStatus.isHealthy) {
            console.warn(`⚠️ API server appears to be offline: ${healthStatus.error?.message}`);
            // Show notification in development
            if (import.meta.env.DEV) {
                setTimeout(() => {
                    alert('API server is not available. Please ensure your backend server is running.');
                }, 1000);
            }
        }
        
        return healthStatus;
    }
};

export default apiService;