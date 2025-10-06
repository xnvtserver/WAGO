import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@/assets/styles/dashboard.css'
import '@/assets/main.css'
import { createI18n } from 'vue-i18n'; // ✅ import i18n
import messages from './locales';
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
});
// Create app instance first
const app = createApp(App)
// Create and install Pinia FIRST
const pinia = createPinia()
app.use(pinia)
// Now we can safely use stores
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
authStore.initialize()
// Install other plugins
app.use(router)
app.use(i18n);

// 🌍 Register envs globally
app.config.globalProperties.$API_URL = import.meta.env.VITE_API_URL
app.config.globalProperties.$API_BASE_URL = import.meta.env.VITE_API_BASE_URL
app.config.globalProperties.$IMG_URL = import.meta.env.VITE_IMG_URL


// Mount the app
app.mount('#app')