<template>
  <header
    class="shadow-sm transition-colors duration-300"
    :class="theme.isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'"
  >
    <div class="flex items-center justify-between px-6 py-4">
      <!-- Sidebar Toggle -->
      <div class="flex items-center">
        <button 
          @click="$emit('toggle-mobile-sidebar')"
          class="md:hidden mr-4"
          :class="theme.isDark ? 'text-white hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'"
        >
          <i class="fas fa-bars text-xl"></i>
        </button>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-4">

          <!-- Logout Button -->
  <div class="relative">
    <button
      @click="handleLogout"
      class="logout-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
      title="Logout"
    >
      <i class="fas fa-sign-out-alt"></i>
    </button>
  </div>
        <!-- Voice Command -->
        <div class="relative">
          <button 
            @click="handleVoiceCommand"
            class="voice-btn bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-colors"
          >
            <i class="fas fa-microphone"></i>
          </button>
          <div 
            v-if="voiceActive"
            class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded"
          >
            Listening...
          </div>
        </div>

        <!-- Theme Switcher -->
 <button
    @click="theme.toggleTheme"
    class="px-2 py-1 rounded text-sm border transition flex items-center justify-center"
    :class="theme.isDark
      ? 'bg-white text-black border-white hover:bg-gray-100'
      : 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800'"
  >
    <component
      :is="theme.isDark ? SunIcon : MoonIcon"
      class="w-5 h-5"
    />
  </button>

        <!-- Notifications -->
        <NotificationDropdown />

        <!-- User Profile -->
        <div class="relative">
          <router-link 
            to="/settings"
            class="flex items-center transition-colors"
            :class="theme.isDark ? 'hover:text-gray-300' : 'hover:text-gray-700'"
          >
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <i class="fas fa-user text-indigo-600"></i>
            </div>
            <span class="ml-2 hidden md:inline" :class="theme.isDark ? 'text-white' : 'text-gray-800'">Admin</span>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NotificationDropdown from './NotificationDropdown.vue';
import { MoonIcon, SunIcon } from '@heroicons/vue/24/solid';
import {useAuthStore} from '../../stores/auth';

// Theme management
import { useThemeStore } from '@/stores/theme';
const theme = useThemeStore();
onMounted(theme.initTheme);

defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  }
});

defineEmits(['toggle-mobile-sidebar', 'voice-command']);

const router = useRouter();
const voiceActive = ref(false);
//Logout
const authStore = useAuthStore(); 
const handleLogout = async () => {
  try {
    await authStore.logout();
    alert('You have been logged out.');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const handleVoiceCommand = () => {
  voiceActive.value = true;
  setTimeout(() => {
    voiceActive.value = false;
    const phrases = [
      "Show me today's sales",
      "What items are low in stock?",
      "Create a new order",
      "Generate inventory report"
    ];
    alert("Voice command detected: " + phrases[Math.floor(Math.random() * phrases.length)]);
  }, 2000);
};
</script>


<style scoped>
.voice-btn {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}
</style>
