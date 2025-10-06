<template>
  <div :class="[isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900']" class="rounded-lg shadow p-6 mb-6">
    <div class="flex justify-between items-center mb-4">
      <h2 :class="isDark ? 'text-white' : 'text-gray-800'" class="text-lg font-semibold">
        Multi-Store Inventory Status
      </h2>
      <select 
        v-model="selectedStore"
        :class="[
          'text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500',
          isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
        ]"
      >
        <option value="all">All Stores</option>
        <option 
          v-for="store in stores"
          :key="store.name"
          :value="store.name"
        >
          {{ store.name }}
        </option>
      </select>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="store in filteredStores"
        :key="store.name"
        :class="[
          'p-4 border rounded-lg hover:shadow-md transition-shadow',
          isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">{{ store.name }}</p>
            <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Last updated: {{ store.lastUpdated }}</p>
          </div>
          <div class="text-right">
            <p class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">{{ store.items }} items</p>
            <p :class="['text-sm', store.stockClass]">{{ store.stockPercentage }} in stock</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const isDark = themeStore.isDark;
const props = defineProps({
  stores: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(store =>
        'name' in store &&
        'items' in store &&
        'stockPercentage' in store &&
        'lastUpdated' in store &&
        'stockClass' in store
      );
    }
  }
})

const selectedStore = ref('all')

const filteredStores = computed(() => {
  if (selectedStore.value === 'all') return props.stores
  return props.stores.filter(store => store.name === selectedStore.value)
})
</script>

<style scoped>
/* Add any specific styling if needed */
</style>
