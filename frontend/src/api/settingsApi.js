// api/settingsApi.js
import { apiFetch } from '@/utils/api';


export default {
  updateUser(payload) {
    return apiFetch(`/settings/users/${payload.userId}`, {
      method: 'PUT',
      body: {
        role: payload.role,
        permissions: payload.permissions
      }
    });
  },
  getStoreInfo() {
    return apiFetch('/settings/store');
  },
  addTaxRate(taxData) {
    return apiFetch('/settings/tax/rates', {
      method: 'POST',
      body: taxData
    });
  },
  updateStoreInfo(data) {
    return apiFetch('/settings/store', {
      method: 'PUT',
      body: data
    });
  },
  getShopUsers() {
    return apiFetch('/settings/users');
  },
  createShopUser(userData) {
    return apiFetch('/settings/users', {
      method: 'POST',
      body: userData
    });
  },
  getTaxSettings() {
    return apiFetch('/settings/tax');
  },
  updateTaxSettings(settings) {
    return apiFetch('/settings/tax', {
      method: 'PUT',
      body: settings
    });
  }
};
