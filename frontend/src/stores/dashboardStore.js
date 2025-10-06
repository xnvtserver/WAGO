//front-end/src/stores
import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';

export const useDashboardStore = defineStore('dashboard', () => {
  const authStore = useAuthStore();
  
  // State
  const stats = ref({});
  const salesData = ref([]);
  const recentOrders = ref([]);
  const topProducts = ref([]);
  const inventoryAlerts = ref([]);
  const storeInventory = ref([]);
  const isLoading = ref(false);

  // Actions
  async function fetchDashboardData() {
    isLoading.value = true;
    try {
      await Promise.all([
        fetchStats(),
        fetchSalesData(),
        fetchRecentOrders(),
        fetchTopProducts(),
        fetchInventoryAlerts(),
        fetchStoreInventory()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      isLoading.value = false;
    }
  }

async function fetchStats() {
  try {
    const res = await api.get('/dashboard/stats');
    stats.value = {
      todaySales: res.data.todaySales || 0,
      todayOrders: res.data.todayOrders || 0,
      todayCustomers: res.data.todayCustomers || 0,
      todayRevenue: res.data.todayRevenue || 0
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    stats.value = {
      todaySales: 0,
      todayOrders: 0,
      todayCustomers: 0,
      todayRevenue: 0
    };
  }
}
async function fetchSalesData() {
  try {
    const res = await api.get('/dashboard/sales');
// In SalesChart.vue, the chart expects the backend to return data in this format:
// [
//   { label: "Mon", value: 1200 },
//   { label: "Tue", value: 1900 },
//   ...
// ]
// But backend getSalesData controller is returning:
// [
//   { date: "2025-05-19T00:00:00.000Z", amount: "1200.00" },
//   { date: "2025-05-20T00:00:00.000Z", amount: "1500.00" },
//   ...
// ]
    // Transform data to expected format
    salesData.value = res.data.map(entry => ({
      label: new Date(entry.date).toLocaleDateString('en-IN', { weekday: 'short' }), // e.g., "Mon"
      value: parseFloat(entry.amount)
    }));
      console.log('Transformed Sales Data:', salesData.value);
  } catch (error) {
    console.error('Failed to fetch sales data:', error);
  }
}

async function fetchRecentOrders() {
  try {
    const res = await api.get('/dashboard/recent-orders');
    recentOrders.value = res.data;
  } catch (error) {
    console.error('Failed to fetch recent orders:', error);
  }
}

async function fetchTopProducts() {
  try {
const res = await api.get('/dashboard/top-products');
   // Your frontend expects this format from the /dashboard/top-products endpoint:
    // [
      // { name: 'Wireless Earbuds', sales: 35 },
      // { name: 'Smart Watch', sales: 28 },
      // ...
    // ]
    // But your backend is returning:
    // [
      // { name: 'Wireless Earbuds', total_sold: '35' },
      // { name: 'Smart Watch', total_sold: '28' },
      // ...
    // ]
    // Transform the data for the chart
topProducts.value = res.data;
  } catch (error) {
    console.error('Failed to fetch top products:', error.response ? error.response.data : error.message);
  }
}

async function fetchInventoryAlerts() {
  try {
    const res = await api.get('/dashboard/inventory-alerts');
    inventoryAlerts.value = res.data;
  } catch (error) {
    console.error('Failed to fetch inventory alerts:', error);
  }
}

async function fetchStoreInventory() {
  try {
    const res = await api.get('/dashboard/store-inventory');
    storeInventory.value = res.data;
  } catch (error) {
    console.error('Failed to fetch store inventory:', error);
  }
}

  return {
    stats,
    salesData,
    recentOrders,
    topProducts,
    inventoryAlerts,
    storeInventory,
    isLoading,
    fetchDashboardData,
    fetchStats,
    fetchSalesData,
    fetchRecentOrders,
    fetchTopProducts,
    fetchInventoryAlerts,
    fetchStoreInventory
  };
});