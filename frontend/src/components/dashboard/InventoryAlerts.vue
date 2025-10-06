<!-- frontend/src/components/dashboard/InventoryAlerts.vue -->
<template>
  <div
    :class="[
      'rounded-lg shadow overflow-hidden',
      isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
    ]"
  >
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 :class="isDark ? 'text-gray-100' : 'text-gray-800'" class="text-lg font-semibold">
          Inventory Alerts
        </h2>
        <button :class="isDark ? 'text-indigo-400' : 'text-indigo-600'" class="text-sm">
          View All
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="alert in dashboardStore.inventoryAlerts"
          :key="alert.title"
          :class="[alertClasses(alert.type), isDark ? 'bg-gray-700' : 'bg-gray-100']"
          class="flex items-start p-3 rounded-lg"
        >
          <div
            :class="[iconClasses(alert.type), isDark ? 'bg-gray-600' : 'bg-white']"
            class="p-2 rounded-full mr-3"
          >
            <i :class="alert.icon"></i>
          </div>
          <div>
            <h4
              :class="[titleClasses(alert.type), isDark ? 'text-gray-100' : 'text-gray-900']"
              class="font-medium"
            >
              {{ alert.title }}
            </h4>
            <p
              :class="[textClasses(alert.type), isDark ? 'text-gray-300' : 'text-gray-700']"
              class="text-sm"
            >
              {{ alert.message }}
            </p>
          </div>
        </div>

        <div v-if="!dashboardStore.inventoryAlerts.length" :class="isDark ? 'text-gray-400' : 'text-gray-400'" class="text-center">
          No inventory alerts at the moment.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme';
import { useDashboardStore } from '@/stores/dashboardStore'

const themeStore = useThemeStore();
const isDark = themeStore.isDark;

const dashboardStore = useDashboardStore()

onMounted(async () => {
  await dashboardStore.fetchInventoryAlerts()
})

const alertClasses = (type) => {
  return {
    danger: 'border border-red-100 bg-red-50',
    warning: 'border border-yellow-100 bg-yellow-50',
    info: 'border border-blue-100 bg-blue-50'
  }[type] || 'border border-gray-100 bg-gray-50'
}

const iconClasses = (type) => {
  return {
    danger: 'bg-red-100 text-red-600',
    warning: 'bg-yellow-100 text-yellow-600',
    info: 'bg-blue-100 text-blue-600'
  }[type] || 'bg-gray-100 text-gray-600'
}

const titleClasses = (type) => {
  return {
    danger: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }[type] || 'text-gray-800'
}

const textClasses = (type) => {
  return {
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  }[type] || 'text-gray-600'
}
</script>

<!-- 
Each alert in dashboardStore.inventoryAlerts should look like:

{
  type: 'danger', // or 'warning', 'info'
  icon: 'fas fa-exclamation',
  title: 'Running Low: Product Name',
  message: 'Only X items left in stock'
} -->