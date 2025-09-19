//front-end/src/stores/theme.js
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false);

  // Load theme from localStorage
  const initTheme = () => {
    const saved = localStorage.getItem('theme');
    isDark.value = saved === 'dark';
    document.documentElement.classList.toggle('dark', isDark.value);
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  // Watch changes to update DOM + localStorage
  watch(isDark, (val) => {
    document.documentElement.classList.toggle('dark', val);
    localStorage.setItem('theme', val ? 'dark' : 'light');
  });

  return {
    isDark,
    toggleTheme,
    initTheme
  };
});
// Toggle switch for dark/light mode.
// Dynamic class bindings using :class and dark: utilities.
// Theme state stored in localStorage for persistence.
// Full updated Vue 3 <script setup> style component.