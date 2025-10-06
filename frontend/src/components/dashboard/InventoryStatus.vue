<!-- frontend/src/components/dashboard/InventoryStatus.vue -->
<template>
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">Multi-Store Inventory Status</h2>
        <select class="text-sm border rounded px-2 py-1">
          <option>All Stores</option>
          <option v-for="store in stores" :key="store.name">{{ store.name }}</option>
        </select>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="store in stores" :key="store.name" class="p-4 border rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ store.name }}</p>
              <p class="text-sm text-gray-500">Last updated: {{ store.updated }}</p>
            </div>
            <div class="text-right">
              <p class="font-medium">{{ store.items }} items</p>
              <p :class="`text-sm ${store.statusColor}`">{{ store.stockPercentage }}% in stock</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const stores = ref([
    { name: 'Main Store', items: 1024, stockPercentage: 98, statusColor: 'text-green-500', updated: '10 min ago' },
    { name: 'North Branch', items: 876, stockPercentage: 92, statusColor: 'text-yellow-500', updated: '15 min ago' },
    { name: 'South Branch', items: 742, stockPercentage: 85, statusColor: 'text-red-500', updated: '5 min ago' },
    { name: 'East Branch', items: 689, stockPercentage: 96, statusColor: 'text-green-500', updated: '20 min ago' }
  ])
  </script>