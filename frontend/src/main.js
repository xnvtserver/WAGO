import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
// Create pinia instance
const pinia = createPinia()

// ✅ install plugins before mount
app.use(pinia)

app.use(router)  

app.mount('#app')
