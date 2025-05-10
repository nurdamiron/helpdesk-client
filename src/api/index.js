// src/api/index.js
import axios from 'axios';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

console.log('API URL:', API_URL); // Debug

// Maximum number of retry attempts for failed requests
const MAX_RETRIES = 3;

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
        
        // Добавляем информацию о пользователе для аутентификации
        const userId = localStorage.getItem('userId');
        const userEmail = localStorage.getItem('userEmail');
        
        if (userId) {
            config.headers['x-user-id'] = userId;
        }
        
        if (userEmail) {
            config.headers['x-user-email'] = userEmail;
        }
        
        // Add retry count to config if not already present
        if (config.retry === undefined) {
            config.retry = 0;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        // Возвращаем данные ответа вместе с дополнительными полями из заголовка ответа
        const result = response.data;
        
        // Добавляем статусы и дополнительные поля, если они есть в ответе
        if (response.headers && response.headers['x-email-sent'] !== undefined) {
            result.email_sent = response.headers['x-email-sent'] === 'true';
        }
        
        return result;
    },
    async (error) => {
        const { config } = error;
        
        // Skip retry for requests with status code 4xx (except 408 Request Timeout)
        const shouldRetry = 
            config && 
            config.retry < MAX_RETRIES && 
            (!error.response || error.response.status === 408 || error.response.status >= 500);
        
        if (shouldRetry) {
            // Increase retry count
            config.retry += 1;
            
            // Exponential backoff delay
            const delay = Math.min(1000 * (2 ** config.retry), 10000);
            
            console.log(`Retrying request to ${config.url} (attempt ${config.retry}/${MAX_RETRIES}) after ${delay}ms`);
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Retry the request
            return api(config);
        }
        
        // Create a custom error object with useful information
        const customError = {
            status: error.response?.status || 0,
            message: error.response?.data?.error || error.message,
            data: error.response?.data || null,
            url: error.config?.url || '',
            retry: config?.retry || 0,
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

// Enhanced API service methods with improved error handling
const apiService = {
    // Basic CRUD operations
    get: async (endpoint, params = {}) => {
        try {
            return await api.get(endpoint, { params });
        } catch (error) {
            console.error(`GET request failed: ${endpoint}`, error);
            throw error;
        }
    },
    
    post: async (endpoint, data = {}) => {
        try {
            return await api.post(endpoint, data);
        } catch (error) {
            console.error(`POST request failed: ${endpoint}`, error);
            throw error;
        }
    },
    
    put: async (endpoint, data = {}) => {
        try {
            return await api.put(endpoint, data);
        } catch (error) {
            console.error(`PUT request failed: ${endpoint}`, error);
            throw error;
        }
    },
    
    patch: async (endpoint, data = {}) => {
        try {
            return await api.patch(endpoint, data);
        } catch (error) {
            console.error(`PATCH request failed: ${endpoint}`, error);
            throw error;
        }
    },
    
    delete: async (endpoint) => {
        try {
            return await api.delete(endpoint);
        } catch (error) {
            console.error(`DELETE request failed: ${endpoint}`, error);
            throw error;
        }
    },
    
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
            return { 
                isHealthy: false, 
                error: {
                    message: error.message,
                    isNetworkError: !error.response
                }
            };
        }
    },
    
    // Websocket availability check
    checkWebsocketAvailability: async () => {
        try {
            // Extract host and construct WebSocket URL
            const apiUrl = new URL(API_URL);
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${apiUrl.host}/ws?checkOnly=true`;
            
            return new Promise((resolve) => {
                // Try to establish connection with short timeout
                const ws = new WebSocket(wsUrl);
                
                // Set timeout to close connection if it takes too long
                const timeout = setTimeout(() => {
                    if (ws.readyState !== WebSocket.OPEN) {
                        ws.close();
                        resolve({ available: false, error: 'Connection timeout' });
                    }
                }, 3000);
                
                ws.onopen = () => {
                    clearTimeout(timeout);
                    ws.close();
                    resolve({ available: true });
                };
                
                ws.onerror = () => {
                    clearTimeout(timeout);
                    ws.close();
                    resolve({ available: false, error: 'Connection error' });
                };
            });
        } catch (error) {
            console.error('WebSocket availability check failed:', error);
            return { available: false, error: error.message };
        }
    },
    
    // Method to initialize API
    init: async () => {
        console.log('API Client initialized with URL:', API_URL);
        const healthStatus = await apiService.checkApiHealth();
        const wsStatus = await apiService.checkWebsocketAvailability();
        
        console.log('WebSocket availability:', wsStatus.available ? 'Available' : 'Unavailable');
        
        if (!healthStatus.isHealthy) {
            console.warn(`⚠️ API server appears to be offline: ${healthStatus.error?.message}`);
            // Show notification in development
            if (import.meta.env.DEV) {
                setTimeout(() => {
                    alert('API server is not available. Please ensure your backend server is running.');
                }, 1000);
            }
        }
        
        return { 
            apiHealth: healthStatus,
            wsAvailable: wsStatus.available
        };
    }
};

export default apiService;