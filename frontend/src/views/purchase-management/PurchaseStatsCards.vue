<template>
<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
  <StatsCard 
    title="Total Purchases"
    :value="stats.totalPurchases"
    icon="fas fa-shopping-bag"
    border-color="border-primary"
    trend-text="12% from last month"
    trend-direction="up"
  />

  <StatsCard 
    title="Active Suppliers"
    :value="stats.activeSuppliers"
    icon="fas fa-users"
    border-color="border-secondary"
    trend-text="3 new this month"
    trend-direction="up"
  />

  <StatsCard 
    title="Pending Orders"
    :value="stats.pendingOrders"
    icon="fas fa-clock"
    border-color="border-yellow-500"
    trend-text="2 overdue"
    trend-direction="down"
  />

  <StatsCard 
    title="Avg. Delivery Time"
    :value="stats.avgDeliveryTime"
    icon="fas fa-truck-fast"
    border-color="border-purple-500"
    trend-text="Faster than last quarter"
    trend-direction="up"
  />
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StatsCard from '@/components/dashboard/StatsCards.vue';
import { apiFetch } from '@/utils/api.js';
import { useThemeStore } from '@/stores/theme'; 
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const themeStore = useThemeStore();

const stats = ref({
  totalPurchases:  0,
  activeSuppliers: 0,
  pendingOrders: 0,
  avgDeliveryTime: '0 days'
});

const fetchStats = async () => {
  try {
    const shopId = authStore.getShopId();
    const data = await apiFetch(`/purchase-orders/${shopId}/stats`);
    stats.value = data;
    console.log('Dashboard stats:', stats.value);
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err.message);
  }
};

onMounted(() => {
  fetchStats();
});
</script>
