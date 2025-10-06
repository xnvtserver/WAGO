// stores/inventoryStore.js
import { defineStore } from 'pinia';
import api from '../utils/axios-api';
import { useAuthStore } from '../stores/auth';

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchInventory(params) {
      try {
        this.loading = true;
        const authToken= useAuthStore.authToken;
        const response = await api.get(`/inv/shop-products/${params.shopId}/`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          },
          params: {
            search: params.search,
            category: params.category,
            status: params.status,
            page: params.page // ✅ Add this line
          }
        });
        this.items = response.data.items;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error('Fetch error:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async updateItem({ id, shopId, data }) {
      try {
        this.loading = true;

        // Add validation
        if (!id || !shopId) {
          throw new Error('Missing required parameters for update');
        }
        const authToken= useAuthStore.authToken;
        const response = await api.put(`/inv/shop-products/${shopId}/${id}`, data , {
          headers: {
            Authorization: `Bearer ${authToken}`
          },
        });

        // Update local state
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
          this.items.splice(index, 1, response.data);
        }
        window.location.reload(); // Full browser refresh
        return response.data;
      } catch (error) {
        this.handleError(error, 'Failed to update item');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    handleError(error, defaultMessage) {
      this.error = error.response?.data?.message || defaultMessage;
      console.error('Inventory error:', error);

      // Special case handling
      if (error.response?.status === 401) {
        console.warn('Authentication expired - redirecting to login');
      }
    }
  }
});
