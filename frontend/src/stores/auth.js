import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    shops: [],
    activeShop: null,
    rememberSession: false,
    permissions: [],
    isInitialized: false
  }),

  actions: {
    async logout() {
      try {
        // Call your API logout endpoint if needed
        //await this.apiFetch('/v1/auth/logout', { method: 'POST' });
        this.clearAuth();
      } catch (error) {
        console.error('Logout API error:', error);
      } finally {
        this.clearAuth(); // Ensure auth is cleared even if API call fails
        router.push('/login'); // Optional: Add router if needed
      }
    },

    setAuth({ token, user, shops, permissions, remember }) {
      const activeShop = shops.length ? shops[0].id : null;

      this.$patch({
        token,
        user,
        shops,
        permissions,
        activeShop,
        rememberSession: remember
      });

      const storage = remember ? localStorage : sessionStorage;

      // Clean both storages before writing
      localStorage.removeItem('auth');
      sessionStorage.removeItem('auth');

      storage.setItem('auth', JSON.stringify({
        token,
        user,
        shops,
        permissions,
        activeShop,
        rememberSession: remember
      }));
    },

    async initialize() {
      if (this.isInitialized) return;

      try {
        const rawAuth = localStorage.getItem('auth') || sessionStorage.getItem('auth') || 'null';
        const authData = JSON.parse(rawAuth);

        if (authData) {
          this.$patch({
            token: authData.token,
            user: authData.user,
            shops: authData.shops,
            permissions: authData.permissions || [],
            activeShop: authData.activeShop || authData.shops?.[0]?.id || null,
            rememberSession: authData.rememberSession
          });
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
        this.clearAuth(); // Fallback if stored data is corrupted
      }

      this.isInitialized = true;
    },

    async validateToken() {
      if (!this.token) return false;

      try {
        await this.apiFetch('/v1/auth/validate');
        return true;
      } catch (error) {
        this.clearAuth();
        return false;
      }
    },

    async fetchShops() {
      try {
        const response = await this.apiFetch('/api/shops');
        this.shops = response.data;
      } catch (error) {
        console.error('Error fetching shops:', error);
        throw error;
      }
    },

    async apiFetch(url, options = {}) {
      console.log('apiFetch Called on url ' + url);
      const isFormData = options.body instanceof FormData;
      const token = this.token;
      const headers = options.headers || {};
      // ✅ Inject token if present
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL; // = 'http://localhost:3000/api'
        const fullUrl = url.startsWith('http') ? url : `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
        const response = await axios({
          method: options.method || 'GET',
          url: fullUrl, // ✅ use full backend URL
          data: options.body,
          headers
        });
        return response.data;
      } catch (error) {
        console.error(`apiFetch API request to ${url} failed:`, error);
        throw error;
      }
    },

    setActiveShop(shopId) {
      this.activeShop = shopId;

      const storage = this.rememberSession ? localStorage : sessionStorage;
      try {
        const authData = JSON.parse(storage.getItem('auth') || '{}');
        authData.activeShop = shopId;
        storage.setItem('auth', JSON.stringify(authData));
      } catch (e) {
        console.error('Failed to update activeShop in storage:', e);
      }
    },

    clearAuth() {
      this.token = null;
      this.user = null;
      this.shops = [];
      this.activeShop = null;
      this.rememberSession = false;
      this.permissions = [];
      this.isInitialized = false;

      localStorage.removeItem('auth');
      sessionStorage.removeItem('auth');
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    },
    getShopId() {
      return this.activeShop || (this.shops.length ? this.shops[0].id : null);
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,

    currentShop: (state) =>
      state.shops.find(shop => shop.id === state.activeShop),

    userShopName: (state) => state.user?.shop_name || 'No Shop Name',

    userShopInitial: (state) =>
      state.user?.shop_name?.charAt(0) || 'S',

    hasPermission: (state) => (permission) => {
      return state.user?.role === 'owner' || state.permissions.includes(permission);
    },

    hasAnyPermission: (state) => (permissions) => {
      if (state.user?.role === 'owner') return true;
      return permissions.some(p => state.permissions.includes(p));
    },

    hasAllPermissions: (state) => (permissions) => {
      if (state.user?.role === 'owner') return true;
      return permissions.every(p => state.permissions.includes(p));
    },

    isOwner: (state) => state.user?.role === 'owner',
    isEmployee: (state) => state.user?.role === 'employee',
    isCustomer: (state) => state.user?.role === 'customer'
  }
});
