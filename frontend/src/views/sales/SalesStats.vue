<template>
  <div class="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
    <StatsCard
      v-for="stat in stats"
      :key="stat.title"
      :loading="loading"
      :title="stat.title"
      :value="stat.value"
      :icon="stat.icon"
      :bg-color="stat.bgColor"
      :text-color="stat.textColor"
      :trend-icon="stat.trendIcon"
      :trend-color="stat.trendColor"
      :trend-text="stat.trendText"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StatsCard from '@/components/dashboard/StatsCards.vue';
import { apiFetch } from '@/utils/api';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const stats = ref([]);
const loading = ref(true);

const fetchStats = async () => {
  if (!authStore.user || !authStore.user.shop_id) return;

  try {
    loading.value = true;
    const shopId = authStore.getShopId();
    const response = await apiFetch(`/sales/stats/${shopId}`);

    stats.value = [
      {
        title: 'Total Sales',
        value: response.totalSales.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
        icon: 'fas fa-shopping-cart',
        bgColor: 'bg-primary bg-opacity-10',
        textColor: 'text-gray-900',
        trendIcon: 'fas fa-arrow-up',
        trendColor: 'text-green-600',
        trendText: 'N/A',
      },
      {
        title: 'Transactions',
        value: response.transactions.toLocaleString(),
        icon: 'fas fa-exchange-alt',
        bgColor: 'bg-blue-100',
        textColor: 'text-gray-900',
        trendIcon: 'fas fa-arrow-up',
        trendColor: 'text-green-600',
        trendText: 'N/A',
      },
      {
        title: 'Avg. Order Value',
        value: response.avgOrderValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
        icon: 'fas fa-dollar-sign',
        bgColor: 'bg-purple-100',
        textColor: 'text-gray-900',
        trendIcon: 'fas fa-arrow-up',
        trendColor: 'text-green-600',
        trendText: 'N/A',
      },
      {
        title: 'Refunds',
        value: response.refunds.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
        icon: 'fas fa-undo',
        bgColor: 'bg-red-100',
        textColor: 'text-gray-900',
        trendIcon: 'fas fa-arrow-up',
        trendColor: 'text-red-600',
        trendText: 'N/A',
      },
    ];
  } catch (err) {
    console.error('Failed to fetch sales stats:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchStats();
});
</script>
