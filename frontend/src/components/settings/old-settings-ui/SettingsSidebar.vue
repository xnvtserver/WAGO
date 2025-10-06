<!-- components/settings/SettingsSidebar.vue -->
<template>
  <div class="hidden md:flex md:flex-shrink-0">
    <div class="flex flex-col w-64 bg-white border-r border-gray-200">
      <div class="flex items-center justify-center h-16 px-4 bg-blue-600">
        <span class="text-white font-bold text-xl">StorePro</span>
      </div>
      <div class="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
        <div class="space-y-1">
          <a v-for="link in links" 
             :key="link.id"
             @click="changeTab(link.id)"
             class="flex items-center px-2 py-3 text-sm font-medium rounded-md sidebar-link"
             :class="{ 'active': currentTab === link.id }">
            <i :class="link.icon" class="mr-3"></i>
            {{ link.label }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['currentTab']);
const emit = defineEmits(['change-tab']);

const links = [
  { id: 'store-info', label: 'Store Information', icon: 'fas fa-store' },
  { id: 'user-management', label: 'User Management', icon: 'fas fa-users-cog' },
  { id: 'tax-settings', label: 'Tax Settings', icon: 'fas fa-receipt' }
  
];

function changeTab(tab) {
  emit('change-tab', tab);
}
</script>

<style scoped>
.sidebar-link {
  @apply text-gray-600 hover:bg-gray-50 hover:text-gray-900;
}
.sidebar-link.active {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
</style>