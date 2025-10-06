<!-- front-end/src/views/dashboard/DashboardView.vue -->
<template>
  <div :class="isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'" class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      :mobile-active="mobileSidebarActive"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Main Content -->
    <div
      class="content-area flex-1 overflow-y-auto"
      :class="[sidebarCollapsed ? 'expanded' : '', isDark ? 'bg-gray-900' : 'bg-white']"
    >
      <!-- Top Navigation -->
      <TopNav
        @toggle-mobile-sidebar="toggleMobileSidebar"
        @voice-command="handleVoiceCommand"
      />

      <!-- Dashboard Content -->
      <main class="p-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            v-for="stat in stats"
            :key="stat.title"
            :loading="dashboardStore.isLoading"
            :title="stat.title"
            :value="dashboardStore.stats[stat.storeKey]"
            :icon="stat.icon"
            :bg-color="stat.bgColor"
            :text-color="stat.textColor"
            :trend-icon="stat.trendIcon"
            :trend-color="stat.trendColor"
            :trend-text="stat.trendText"
          />
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SalesChart />
          <ProductsChart />
        </div>

        <!-- Inventory Status -->
        <MultiStoreInventory :stores="stores" />

        <!-- Recent Orders & Alerts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RecentOrders :orders="orders" />
          <InventoryAlerts :alerts="alerts" />
        </div>

        <!-- Replenishment Suggestions -->
        <!-- <AutoReplenishment :suggestions="replenishmentSuggestions" /> -->
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import TopNav from '@/components/dashboard/TopNav.vue';
import StatsCard from '@/components/dashboard/StatsCards.vue';
import SalesChart from '@/components/dashboard/SalesChart.vue';
import ProductsChart from '@/components/dashboard/ProductsChart.vue';
import MultiStoreInventory from '@/components/dashboard/MultiStoreInventory.vue';
import RecentOrders from '@/components/dashboard/RecentOrders.vue';
import InventoryAlerts from '@/components/dashboard/InventoryAlerts.vue';
import AutoReplenishment from '@/components/dashboard/AutoReplenishment.vue';
import { useDashboardStore } from '@/stores/dashboardStore.js';
import { useThemeStore } from '@/stores/theme';
// import { useDashboardStore } from '@/stores/dashboard';

const themeStore = useThemeStore();
const isDark = themeStore.isDark;
const sidebarCollapsed = ref(false);
const mobileSidebarActive = ref(false);
const dashboardStore = useDashboardStore();

// ✅ Only one definition of stats
const stats = reactive([
  {
    title: "ഇന്നത്തെ വിറ്റുവരവ്",
    storeKey: "todaySales",
    icon: "fas fa-dollar-sign",
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    trendIcon: "fas fa-arrow-up",
    trendColor: "text-green-600",
    trendText: "12% from yesterday"
  },
  {
    title: "ഇന്നത്തെ ഓർഡറുകൾ",
    storeKey: "todayOrders",
    icon: "fas fa-shopping-cart",
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    trendIcon: "fas fa-arrow-up",
    trendColor: "text-green-600",
    trendText: "12% increase"
  },
  {
    title: "ഇന്നത്തെ പുതു കസ്റ്റമേഴ്‌സ്",
    storeKey: "todayCustomers",
    icon: "fas fa-users",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    trendIcon: "fas fa-arrow-up",
    trendColor: "text-blue-600",
    trendText: "5% growth"
  },
    {
    title: "സ്റ്റോക്ക് കുറവുള്ള ഉൽപ്പന്നങ്ങൾ",
    storeKey: "todayRevenue",// bug identified this is not the revenue this is may the remaining quantity of item that sells 
    icon: "fas fa-users",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    trendIcon: "fas fa-arrow-up",
    trendColor: "text-blue-600",
    trendText: "5% growth"
  },
]);

const stores = reactive([
  {
    name: "Main Store",
    items: "1,024",
    stockPercentage: "98% in stock",
    lastUpdated: "10 min ago",
    stockClass: "text-green-500"
  },
]);

const orders = reactive([
  {
    id: "#ORD-1001",
    customer: "John Smith",
    amount: "$125.00",
    status: "Completed",
    statusClass: "bg-green-100 text-green-800"
  },
]);

const alerts = reactive([
  {
    title: "Running Low: Wireless Earbuds",
    text: "Only 3 items left in stock",
    bgClass: "border-red-100 bg-red-50",
    iconBgClass: "bg-red-100",
    icon: "fas fa-exclamation",
    titleClass: "text-red-800",
    textClass: "text-red-600"
  },
]);

const replenishmentSuggestions = reactive([
  {
    product: "Wireless Earbuds",
    category: "Electronics",
    currentStock: "3",
    suggestedQty: "25",
    timeframe: "Immediate",
    action: "Order Now",
    stockClass: "low-stock",
    iconBgClass: "bg-red-100",
    icon: "fas fa-headphones",
    iconColor: "text-red-500",
    stockLabelClass: "bg-red-100 text-red-800",
    timeframeClass: "text-red-500"
  },
]);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const toggleMobileSidebar = () => {
  mobileSidebarActive.value = !mobileSidebarActive.value;
};

const handleVoiceCommand = () => {
  const phrases = [
    "Show me today's sales",
    "What items are low in stock?",
    "Create a new order",
    "Generate inventory report"
  ];
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  alert("Voice command detected: " + randomPhrase);
};
onMounted(async () => {
  await dashboardStore.fetchDashboardData();
});
onMounted(() => {
  setInterval(() => {
    replenishmentSuggestions.forEach(suggestion => {
      const change = Math.floor(Math.random() * 3) - 1;
      let newValue = parseInt(suggestion.currentStock) + change;
      newValue = Math.max(0, newValue);
      suggestion.currentStock = newValue.toString();

      if (newValue < 10) {
        Object.assign(suggestion, {
          stockClass: "low-stock",
          iconBgClass: "bg-red-100",
          iconColor: "text-red-500",
          stockLabelClass: "bg-red-100 text-red-800",
          timeframe: "Immediate",
          action: "Order Now",
          timeframeClass: "text-red-500"
        });
      } else if (newValue < 20) {
        Object.assign(suggestion, {
          stockClass: "medium-stock",
          iconBgClass: "bg-yellow-100",
          iconColor: "text-yellow-500",
          stockLabelClass: "bg-yellow-100 text-yellow-800",
          timeframe: "3 Days",
          action: "Schedule",
          timeframeClass: "text-yellow-500"
        });
      } else {
        Object.assign(suggestion, {
          stockClass: "healthy-stock",
          iconBgClass: "bg-green-100",
          iconColor: "text-green-500",
          stockLabelClass: "bg-green-100 text-green-800",
          timeframe: "Next Week",
          action: "Remind Me",
          timeframeClass: "text-green-500"
        });
      }
    });
  }, 5000);
});
</script>

<style scoped>
.content-area {
  transition: all 0.3s;
}
.content-area.expanded {
  margin-left: 70px;
}
@media (max-width: 768px) {
  .content-area {
    margin-left: 0 !important;
  }
}
.chart-container {
  height: 300px;
}
.low-stock {
  border-left: 4px solid #ef4444;
}
.medium-stock {
  border-left: 4px solid #f59e0b;
}
.healthy-stock {
  border-left: 4px solid #10b981;
}
</style>
