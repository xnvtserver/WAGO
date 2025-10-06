<!-- frontend/src/components/dashboard/SalesChart.vue -->
<template>
  <div :class="[isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900']" class="rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 :class="isDark ? 'text-white' : 'text-gray-800'" class="text-lg font-semibold">Sales Overview</h2>
      <div class="flex space-x-2">
        <button :class="isDark ? 'bg-indigo-800 text-indigo-100' : 'bg-indigo-100 text-indigo-700'" class="px-3 py-1 text-xs rounded">Week</button>
        <button :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'" class="px-3 py-1 text-xs rounded">Month</button>
        <button :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'" class="px-3 py-1 text-xs rounded">Year</button>
      </div>
    </div>
    <div class="chart-container h-64">
      <canvas ref="chartElement"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import Chart from 'chart.js/auto'
import { useThemeStore } from '@/stores/theme.js';

const themeStore = useThemeStore();
const isDark = themeStore.isDark;
const dashboardStore = useDashboardStore()
const chartElement = ref(null)
const chartInstance = ref(null)

onMounted(async () => {
  await dashboardStore.fetchSalesData()
  renderChart()
})

// Watch salesData in case it gets updated later
watch(() => dashboardStore.salesData, () => {
  updateChart()
})

function renderChart() {
  if (!chartElement.value) return

  chartInstance.value = new Chart(chartElement.value, {
    type: 'line',
    data: buildChartData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        y: { beginAtZero: true, grid: { drawBorder: false } },
        x: { grid: { display: false } }
      }
    }
  })
}

function buildChartData() {
  const labels = dashboardStore.salesData.map(entry => entry.label) // e.g., days
  const data = dashboardStore.salesData.map(entry => entry.value)   // e.g., ₹ amount

  return {
    labels,
    datasets: [
      {
        label: 'Sales',
        data,
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  }
}

function updateChart() {
  if (!chartInstance.value) return
  chartInstance.value.data = buildChartData()
  chartInstance.value.update()
}
</script>

<!-- 🧠 Expected Structure of salesData
For this to work, your /dashboard/sales API should return something like:
[
  { "label": "Mon", "value": 1200 },
  { "label": "Tue", "value": 1900 },
  ...
] -->