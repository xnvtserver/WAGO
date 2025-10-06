import { defineStore } from 'pinia';
import api from '../utils/axios-api';
import { useAuthStore } from './auth';

export const useShopPermissionsStore = defineStore('shopPermissions', {
  state: () => ({
    permissions: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchPermissions(shopId) {
      try {
        this.loading = true;
        // Use provided shopId or fallback to auth store's shopId
        const authStore = useAuthStore();
        const effectiveShopId = shopId || authStore.getShopId();
        if (!effectiveShopId) {
          throw new Error('No shop ID available to fetch permissions.');
        }
        const response = await api.get(`/shop-permissions/${effectiveShopId}`);
        // const response = await api.get(`/shop-permissions/${shopId}`);
        this.permissions = response.data;
      } catch (error) {
        this.error = error.response?.data?.error || error.message;
      } finally {
        this.loading = false;
      }
    },

    async createPermission(shopId, data) {
      try {
        this.loading = true;
        const response = await api.post(`/shop-permissions/${shopId}`, data);
        this.permissions.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updatePermission(shopId, permissionId, updates) {
      try {
        this.loading = true;
        const response = await api.put(`/shop-permissions/${shopId}/${permissionId}`, updates);
        const index = this.permissions.findIndex(p => p.id === permissionId);
        if (index !== -1) this.permissions.splice(index, 1, response.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePermission(shopId, permissionId) {
      try {
        this.loading = true;
        await api.delete(`/shop-permissions/${shopId}/${permissionId}`);
        this.permissions = this.permissions.filter(p => p.id !== permissionId);
      } catch (error) {
        this.error = error.response?.data?.error || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});