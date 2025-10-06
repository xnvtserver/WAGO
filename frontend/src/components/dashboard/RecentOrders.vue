<!-- frontend/src/components/dashboard/RecentOrders.vue -->
<template>
  <div :class="[isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900']" class="rounded-lg shadow overflow-hidden">
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 :class="isDark ? 'text-white' : 'text-gray-800'" class="text-lg font-semibold">Recent Orders</h2>
        <button :class="isDark ? 'text-indigo-300' : 'text-indigo-600'" class="text-sm">View All</button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr :class="[isDark ? 'text-gray-300 border-gray-700' : 'text-left border-b border-gray-200']">
              <th class="pb-2 font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Order ID</th>
              <th class="pb-2 font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Customer</th>
              <th class="pb-2 font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Amount</th>
              <th class="pb-2 font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in dashboardStore.recentOrders"
              :key="order.id"
              :class="[isDark ? 'border-b border-gray-700 hover:bg-gray-700' : 'border-b border-gray-100 hover:bg-gray-50']"
            >
              <td class="py-3">#{{ order.po_number }}</td>
              <td class="py-3">{{ order.customer_name }}</td>
              <td class="py-3">₹{{ order.total_amount }}</td>
              <td class="py-3">
                <span :class="statusClasses(order.status)">
                  {{ order.status }}
                </span>
              </td>
            </tr>

            <tr v-if="!dashboardStore.recentOrders.length">
              <td colspan="4" :class="isDark ? 'py-4 text-center text-gray-500' : 'py-4 text-center text-gray-400'">
                No recent orders found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme';
import { useDashboardStore } from '../../stores/dashboardStore';

const themeStore = useThemeStore();
const isDark = themeStore.isDark;
const dashboardStore = useDashboardStore()

onMounted(async () => {
  await dashboardStore.fetchRecentOrders()
})

const statusClasses = (status) => {
  return {
    Completed: 'px-2 py-1 text-xs bg-green-100 text-green-800 rounded',
    Processing: 'px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded',
    Shipped: 'px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded'
  }[status] || 'px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded'
}
</script>
<!-- 
The expected shape of each order in dashboardStore.recentOrders is:
{
  id: 'ORD-1001',
  customer: 'John Smith',
  amount: 125.00,
  status: 'Completed'
} -->