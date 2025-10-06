<template>
  <div :class="themeStore.isDark ? 'dark bg-gray-800' : 'bg-white'" class="rounded-xl shadow-sm overflow-hidden mb-6">
    <div :class="themeStore.isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'" class="px-6 py-4 flex items-center justify-between">
      <h2 :class="themeStore.isDark ? 'text-red-500' : 'text-red-500'" class="text-lg font-medium">Top Suppliers</h2>
      <button 
        @click="$emit('add-supplier')"
        :class="themeStore.isDark ? 'text-primary hover:text-primary/80' : 'text-primary hover:text-primary/80'"
        class="flex items-center space-x-1"
      >
        <i class="fas fa-plus"></i>
        <span>Add Supplier</span>
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <div 
        v-for="supplier in suppliers" 
        :key="supplier.id"
        :class="[
          'border rounded-lg p-4 hover:shadow-md transition',
          themeStore.isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        ]"
      >
        <div class="flex items-center space-x-3 mb-3">
          <div :class="supplier.iconBgClass" class="h-12 w-12 rounded-full flex items-center justify-center">
            <i :class="supplier.icon" class="text-xl"></i>
          </div>
          <div>
            <h3 class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">{{ supplier.name }}</h3>
            <p class="text-sm" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'">Since {{ supplier.since }}</p>
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'">Orders</span>
            <span :class="themeStore.isDark ? 'text-white' : 'text-gray-900'" class="font-medium">{{ supplier.orders }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'">Total Spent</span>
            <span :class="themeStore.isDark ? 'text-white' : 'text-gray-900'" class="font-medium">{{ supplier.totalSpent }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'">Last Order</span>
            <span :class="themeStore.isDark ? 'text-white' : 'text-gray-900'" class="font-medium">{{ supplier.lastOrder }}</span>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t dark:border-gray-700 flex justify-between">
          <button class="text-sm text-primary hover:text-primary/80">View Details</button>
          <div class="flex space-x-2">
            <button class="text-gray-400 hover:text-blue-500"><i class="fas fa-phone"></i></button>
            <button class="text-gray-400 hover:text-green-500"><i class="fas fa-envelope"></i></button>
            <button class="text-gray-400 hover:text-red-500"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { apiFetch } from '@/utils/api'; // corrected path
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const themeStore = useThemeStore();
const suppliers = ref([]);



// Fetch top suppliers for a shop
const fetchSuppliers = async () => {
  try {
    const shopId = authStore.getShopId();
    const data = await apiFetch(`/suppliers/${shopId}/topSuppliers`);
    suppliers.value = data;
    console.log('Suppliers loaded:', suppliers.value);
  } catch (err) {
    console.error('Failed to fetch suppliers:', err.message);
  }
};

// Initialize theme on mount
onMounted(() => {
  themeStore.initTheme();
  fetchSuppliers();
});
</script>


