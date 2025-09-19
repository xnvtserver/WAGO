import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const productApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

let authStoreInstance = null;
const setAuthStore = (store) => {
  authStoreInstance = store;
};
// Add request interceptor to include auth token
productApi.interceptors.request.use(config => {
  if (authStoreInstance?.token) {
    config.headers.Authorization = `Bearer ${authStoreInstance.token}`;
  }
  return config;
});

export default {
  async createProduct(shopId, formData) {
        const authStore = useAuthStore();
    const token = authStore.token;
        if (!token) {
      console.error('Authentication token not found in productService.createProduct');
      // Optionally, trigger logout or redirect here if token is expected to always exist
      throw new Error('Authentication token is missing. Please log in again.');
    }
    try {
      const response = await productApi.post(`/products/${shopId}`, formData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error) {
    if (error.response) {
      // Server responded with non-2xx status
      return {
        status: error.response.status,
        message: error.response.data?.message || 'Server error occurred',
        errors: error.response.data?.errors
      };
    } else if (error.request) {
      // Request made but no response
      return { message: 'No response from server. Check network connection.' };
    } else {
      // Other errors
      return { message: error.message || 'Unknown error occurred' };
    }
  }
};