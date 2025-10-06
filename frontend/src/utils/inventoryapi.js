import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const authStore = useAuthStore();
  
  // Add authorization header if logged in
  if (authStore.isAuthenticated) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  
  // Add shop ID to headers if available
  if (authStore.activeShop) {
    config.headers['X-Shop-Id'] = authStore.activeShop;
  }
  
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();
    
    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt token refresh
        await authStore.refreshToken();
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        authStore.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;