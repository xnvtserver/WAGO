//front-end/src/utils/auth.js
import { useAuthStore } from '@/stores/auth'
// Centralized Auth Helper
export default {
  // Get token from both storage locations
  getToken() {
    try {
      return useAuthStore().token
    } catch (error) {
      console.error('Auth store access failed:', error)
      return null
    }
  },
  // Store token based on "remember me" choice
  setToken(token, remember = true) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', token);
  },
  // Clear tokens from both locations
  clearToken() {
    const authStore = useAuthStore()
    authStore.clearAuth()
  },
  // Add user data management
  setUser(user, remember = true) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(user));
  },
  getUser() {
    try {
      return useAuthStore().user
    } catch (error) {
      console.error('Auth store access failed:', error)
      return null
    }
  },

  clearUser() {
    localStorage.removeItem('authUser')
    sessionStorage.removeItem('authUser')
  },

  // COMBINED CLEAR
  logout() {
    this.clearToken()
    this.clearUser()
  },

  // AUTH STATE CHECK
  isAuthenticated() {
    return !!this.getToken()
  }, 
  async refreshToken() {
    try {
      const authStore = useAuthStore();
      const response = await axios.post('/auth/refresh/', {
        refresh: authStore.refreshToken
      });
      
      this.setToken(response.data.access);
      return response.data.access;
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  getRefreshToken() {
    const authStore = useAuthStore();
    return authStore.refreshToken;
  },

  // Add shop ID handling
getActiveShop() {
  const authStore = useAuthStore();
  if (!authStore.activeShop) {
    console.warn('No active shop selected');
    return null;
  }
  return authStore.activeShop;
},


  state: () => ({
    user: null,
    token: null,
    refreshToken: null,
    activeShop: null, // ✅ Must be defined
  }),

  actions: {
    setActiveShop(shop) {
      this.activeShop = shop
    },
    clearAuth() {
      this.user = null
      this.token = null
      this.refreshToken = null
      this.activeShop = null
    }
  }
}