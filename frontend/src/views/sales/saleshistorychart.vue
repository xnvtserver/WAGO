<template>
  <div class="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
    <!-- Sales Trend -->
    <div class="p-4 bg-white rounded-lg shadow">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Sales Trend</h3>
        <div class="flex space-x-2">
          <button class="px-3 py-1 text-xs bg-primary text-white rounded-md">Daily</button>
          <button class="px-3 py-1 text-xs bg-white text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Weekly</button>
          <button class="px-3 py-1 text-xs bg-white text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Monthly</button>
        </div>
      </div>
      <div class="chart-container">
        <canvas id="salesTrendChart"></canvas>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="p-4 bg-white rounded-lg shadow">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Payment Methods</h3>
        <div class="relative">
          <select class="block w-full px-3 py-1 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>
      <div class="chart-container">
        <canvas id="paymentMethodsChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import { useAuthStore } from '@/stores/auth'; // Adjust path if needed
import { apiFetch } from '@/utils/api'; // Adjust path if needed
// import { formatDate } from '../..utils/format.js'; // Adjust path if needed

const authStore = useAuthStore();

const salesData = ref([]);
const filteredData = ref([]);
const paginatedData = ref([]);
const loading = ref(false);

// Fetch and process data
onMounted(async () => {
  try {
    loading.value = true;
    const shop_id = authStore.getShopId();
    const response = await apiFetch(`/sales/saleshistory/${shop_id}`);

    salesData.value = response.map((item) => {
      try {
        return {
          ...item,
          rawDate: item.date,
          formattedDate: tem.date,
          quantity: Number(item.quantity) || 0,
          price: Number(item.price) || 0,
          total: Number(item.total) || 0,
        };
      } catch (e) {
        console.error('Data processing error:', e, item);
        return {
          ...item,
          rawDate: new Date().toISOString(),
          formattedDate: 'Invalid Date',
          quantity: 0,
          price: 0,
          total: 0,
        };
      }
    });

    filteredData.value = [...salesData.value];
    paginatedData.value = [...salesData.value.slice(0, 10)];

    renderSalesTrendChart();

  } catch (err) {
    console.error('API Error:', err);
    salesData.value = [];
  } finally {
    loading.value = false;
  }
});

// Totals
const pageTotalQuantity = computed(() =>
  paginatedData.value.reduce((sum, item) => sum + Number(item.quantity), 0)
);

const pageTotalAmount = computed(() =>
  paginatedData.value.reduce((sum, item) => sum + Number(item.total), 0)
);

const grandTotalQuantity = computed(() =>
  filteredData.value.reduce((sum, item) => sum + Number(item.quantity), 0)
);

const grandTotalAmount = computed(() =>
  filteredData.value.reduce((sum, item) => sum + Number(item.total), 0)
);

// Sales trend computation
const salesTrends = computed(() => {
  const trendsMap = {};

  filteredData.value.forEach((sale) => {
    const dateStr = new Date(sale.rawDate).toISOString().split('T')[0];
    if (!trendsMap[dateStr]) trendsMap[dateStr] = 0;
    trendsMap[dateStr] += sale.total;
  });

  let trends = Object.entries(trendsMap)
    .map(([date, total]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total,
      rawDate: date,
    }))
    .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));

  if (trends.length > 30) trends = trends.slice(-30);

  const maxTotal = Math.max(...trends.map((t) => t.total), 1);

  return trends.map((t) => ({
    ...t,
    percent: (t.total / maxTotal) * 100,
  }));
});

const showTrends = computed(() => salesTrends.value.length > 0 && !loading.value);

// Render Chart
let salesChart;

function renderSalesTrendChart() {
  const ctx = document.getElementById('salesTrendChart');
  if (!ctx) return;

  if (salesChart) salesChart.destroy();

  const labels = salesTrends.value.map((t) => t.date);
  const data = salesTrends.value.map((t) => t.total);

  salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Sales',
          data,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
</script>
