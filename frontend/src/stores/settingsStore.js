// stores/settingsStore.js
import { defineStore } from 'pinia';
import settingsApi from '@/api/settingsApi';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    storeInfo: null,
    users: [],
    taxSettings: {
      inclusive: false,
      shippingTax: true,
      rates: []
    }
  }),

  actions: {

async addTaxRate(taxData) {
    try {
      const response = await settingsApi.addTaxRate(taxData);
      this.taxSettings.rates.push(response.data);
      return true;
    } catch (error) {
      throw error;
    }
  },


      async updateUser(payload) {
    try {
      const response = await settingsApi.updateUser(payload);
      const index = this.users.findIndex(u => u.id === payload.userId);
      if (index !== -1) {
        this.users.splice(index, 1, response.data);
      }
      return true;
    } catch (error) {
      throw error;
    }
  }, 
    async fetchStoreInfo() {
      try {
        const response = await settingsApi.getStoreInfo();
        this.storeInfo = response.data;
      } catch (error) {
        throw error;
      }
    },

    async updateStoreInfo(updates) {
      try {
        const response = await settingsApi.updateStoreInfo(updates);
        this.storeInfo = response.data;
        return true;
      } catch (error) {
        throw error;
      }
    },

    async fetchShopUsers() {
      try {
        const response = await settingsApi.getShopUsers();
        this.users = response.data;
      } catch (error) {
        throw error;
      }
    },

    async createShopUser(userData) {
      try {
        const response = await settingsApi.createShopUser(userData);
        this.users.push(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async fetchTaxSettings() {
      try {
        const response = await settingsApi.getTaxSettings();
        this.taxSettings = {
          inclusive: response.data.tax_inclusive,
          shippingTax: response.data.tax_on_shipping,
          rates: response.data.tax_rates || []
        };
      } catch (error) {
        throw error;
      }
    },

    async updateTaxSettings(settings) {
      try {
        const response = await settingsApi.updateTaxSettings(settings);
        this.taxSettings = {
          inclusive: response.data.tax_inclusive,
          shippingTax: response.data.tax_on_shipping,
          rates: response.data.tax_rates
        };
        return true;
      } catch (error) {
        throw error;
      }
    }
  },

  getters: {
    canManageUsers: (state) => {
      const authStore = useAuthStore();
      return authStore.user.role === 'owner' || 
        authStore.user.permissions.includes('manage_users');
    }
  }
});