//front-end/src/utils/axios-api.js
import axios from 'axios';
import auth from '@/utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  // Add authorization header
  const token = auth.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add shop ID header if available
  const shopId = auth.getActiveShop();
  if (shopId) {
    config.headers['X-Shop-ID'] = shopId;
  }

  return config;
});

// Response interceptor
// Add proper error handling
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await auth.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        auth.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;