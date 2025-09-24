import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)      // ✅ Define the app first
const pinia = createPinia()     // ✅ Create Pinia instance

app.use(pinia)                  // ✅ Register plugins
app.use(router)

app.mount('#app')               // ✅ Mount the app