// api.js
import axios from 'axios';

const createApiInstance = (basePath = '/api') => {
  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${basePath}`,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add auth interceptor
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('auth') || sessionStorage.getItem('auth');
    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token).token}`;
    }
    return config;
  });

  return api;
};

export const fetchSalesData = async (period = '30d', page = 1) => {
  try {
    console.log('api -- fetchSalesData called');
    const res = await api.get('/dashboard/sales', {
      params: { period, page }
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch sales data');
  }
};

// Export default and named APIs for specific use
export const defaultApi = createApiInstance('');
export const pricingApi = createApiInstance('/api/pricing');
//for eg :  defaultApi for general usage
//defaultApi.get('/users');
// pricingApi for pricing-specific endpoints
//pricingApi.get('/plans');

export default defaultApi;
