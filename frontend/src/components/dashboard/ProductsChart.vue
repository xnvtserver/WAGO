<!-- frontend/src/components/dashboard/ProductsChart.vue -->
<template>
  <div :class="[isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900']" class="rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 :class="isDark ? 'text-white' : 'text-gray-800'" class="text-lg font-semibold">Top Selling Products</h2>
      <button :class="isDark ? 'text-indigo-300' : 'text-indigo-600'" class="text-sm">View All</button>
    </div>
    <div class="chart-container">
      <canvas ref="chartElement"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useThemeStore } from '@/stores/theme.js';

const themeStore = useThemeStore();
const isDark = themeStore.isDark;

const chartElement = ref(null)
let chartInstance = null

const dashboardStore = useDashboardStore()

// Watch for data updates
watch(() => dashboardStore.topProducts, async () => {
  await renderChart()
})

// Lifecycle mount
onMounted(async () => {
  if (!dashboardStore.topProducts.length) {
    await dashboardStore.fetchTopProducts()
  }
  await renderChart()
})

async function renderChart() {
  await nextTick() // Ensure canvas is rendered

  // Destroy old chart if it exists
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const labels = dashboardStore.topProducts.map(p => p.name)
  const data = dashboardStore.topProducts.map(p => p.sales)

  if (!chartElement.value) return

  chartInstance = new Chart(chartElement.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(129, 140, 248, 0.8)',
          'rgba(165, 180, 252, 0.8)',
          'rgba(199, 210, 254, 0.8)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      },
      cutout: '70%'
    }
  })
}
</script>

<!-- 
The dashboardStore.topProducts array should look like:
[
  { name: 'Wireless Earbuds', sales: 35 },
  { name: 'Smart Watch', sales: 28 },
  { name: 'Bluetooth Speaker', sales: 20 },
  { name: 'USB-C Cable', sales: 15 },
  { name: 'Power Bank', sales: 12 }
] -->