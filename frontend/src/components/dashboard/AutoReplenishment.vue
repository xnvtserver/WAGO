<template>
  <div
    :class="[
      'rounded-lg shadow mt-6',
      isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
    ]"
  >
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 :class="isDark ? 'text-gray-100' : 'text-gray-800'" class="text-lg font-semibold">
          Auto-Replenishment Suggestions
        </h2>
        <div class="flex space-x-2">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            :class="[
              'px-3 py-1 text-xs rounded transition-colors',
              activeFilter === filter.value
                ? isDark ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white'
                : isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table :class="isDark ? 'min-w-full divide-y divide-gray-700' : 'min-w-full divide-y divide-gray-200'">
          <thead :class="isDark ? 'bg-gray-900' : 'bg-gray-50'">
            <tr>
              <th
                v-for="heading in tableHeadings"
                :key="heading"
                class="px-4 py-2 text-left text-xs font-medium uppercase"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ heading }}
              </th>
            </tr>
          </thead>
          <tbody :class="isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'">
            <tr
              v-for="suggestion in filteredSuggestions"
              :key="suggestion.product + suggestion.category"
              :class="[suggestion.stockClass, isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100']"
            >
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    :class="['flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center', suggestion.iconBgClass]"
                  >
                    <i :class="[suggestion.icon, suggestion.iconColor]"></i>
                  </div>
                  <div class="ml-4">
                    <div :class="isDark ? 'text-gray-100' : 'text-gray-900'" class="text-sm font-medium">
                      {{ suggestion.product }}
                    </div>
                    <div :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-sm">
                      {{ suggestion.category }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    suggestion.stockLabelClass,
                    isDark ? 'bg-gray-700' : ''
                  ]"
                >
                  {{ suggestion.currentStock }}
                </span>
              </td>
              <td :class="['px-4 py-3 whitespace-nowrap text-sm', isDark ? 'text-gray-100' : 'text-gray-900']">
                {{ suggestion.suggestedQty }}
              </td>
              <td :class="['px-4 py-3 whitespace-nowrap text-sm', isDark ? 'text-gray-300' : '']">
                <span :class="suggestion.timeframeClass">{{ suggestion.timeframe }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <button
                  @click="handleAction(suggestion)"
                  :class="isDark ? 'text-indigo-400 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-900'"
                >
                  {{ suggestion.action }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const isDark = themeStore.isDark;
const dashboardStore = useDashboardStore()
const activeFilter = ref('all')

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Urgent', value: 'low-stock' },
  { label: 'Soon', value: 'medium-stock' }
]

onMounted(() => {
  if (!dashboardStore.storeInventory.length) {
    dashboardStore.fetchStoreInventory()
  }
})

const filteredSuggestions = computed(() => {
  if (activeFilter.value === 'all') return dashboardStore.storeInventory
  return dashboardStore.storeInventory.filter(item => item.stockClass === activeFilter.value)
})

const emit = defineEmits(['action'])

const handleAction = (suggestion) => {
  emit('action', suggestion)
}
</script>

<style scoped>
.low-stock {
  border-left: 4px solid #ef4444;
}
.medium-stock {
  border-left: 4px solid #f59e0b;
}
.healthy-stock {
  border-left: 4px solid #10b981;
}
tr {
  transition: all 0.2s ease;
}
tr:hover {
  background-color: #f8fafc;
}
</style>

<!-- Each item in dashboardstoreInventory should contain the following fields (already styled):
{
  product: 'Product Name',
  category: 'Category',
  currentStock: 12,
  suggestedQty: 30,
  timeframe: 'Next 7 Days',
  action: 'Reorder',

  stockClass: 'low-stock' | 'medium-stock' | 'healthy-stock',
  icon: 'fas fa-box',
  iconColor: 'text-red-600',
  iconBgClass: 'bg-red-100',
  stockLabelClass: 'bg-red-100 text-red-800',
  timeframeClass: 'text-red-500'
} -->