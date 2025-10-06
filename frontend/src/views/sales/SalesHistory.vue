<template>
  <div     :class="[
      'flex h-screen overflow-hidden',
      themeStore.isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    ]" class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :collapsed="sidebarCollapsed" :mobile-active="mobileSidebarActive" @toggle-sidebar="toggleSidebar" />

    <!-- Main content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Top navigation -->
      <TopNav @toggle-mobile-sidebar="toggleMobileSidebar" @voice-command="handleVoiceCommand" />

      <!-- Main content area -->
      <div :class="themeStore.isDark ? 'bg-gray-900' : 'bg-white'" class="flex-1 overflow-auto p-4 md:p-6">
<!-- Filters and controls -->
<div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
  <!-- Left 3 columns: Date + Search + Filter -->
  <div class="md:col-span-3">
    <div class="flex flex-col md:flex-row gap-4 md:items-center">
      <!-- Date Picker -->
      <div class="relative w-full md:flex-1">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <i :class="themeStore.isDark ? 'fas fa-calendar text-gray-500' : 'fas fa-calendar text-gray-400'"></i>
        </div>
        <input
          type="text"
          id="dateRangePicker"
          placeholder="തീയതി തിരഞ്ഞെടുക്കുക"
          :class="[
            'w-full pl-10 pr-4 py-2 border rounded-md focus:ring-primary focus:border-primary',
            themeStore.isDark
              ? 'bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-500'
              : 'bg-white text-gray-800 border-gray-300 placeholder-gray-400'
          ]"
        />
      </div>

      <!-- Search Field -->
      <div class="relative w-full md:flex-1">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <i :class="themeStore.isDark ? 'fas fa-search text-gray-500' : 'fas fa-search text-gray-400'"></i>
        </div>
        <input
          type="text"
          placeholder="Search transactions..."
          :class="[
            'w-full pl-10 pr-4 py-2 border rounded-md focus:ring-primary focus:border-primary',
            themeStore.isDark
              ? 'bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-500'
              : 'bg-white text-gray-800 border-gray-300 placeholder-gray-400'
          ]"
        />
      </div>

      <!-- Filter Button -->
      <div class="w-full md:w-auto">
        <button
          type="button"
          :class="[
            'w-full md:w-auto px-4 py-2 font-medium rounded-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2',
            themeStore.isDark
              ? 'bg-primary text-white hover:bg-primary/90 ring-offset-gray-900'
              : 'bg-primary text-white hover:bg-primary/90 ring-offset-white'
          ]"
        >
          <i :class="themeStore.isDark ? 'fas fa-filter text-red-400' : 'fas fa-filter text-red-600'"></i>
          Filter
        </button>
      </div>
    </div>
  </div>

  <!-- Right column: Export Button -->
  <div class="flex justify-end items-center">
    <button
      type="button"
      :class="[
        'w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
        themeStore.isDark
          ? 'bg-secondary text-white hover:bg-secondary/90 ring-offset-gray-900'
          : 'bg-secondary text-white hover:bg-secondary/90 ring-offset-white'
      ]"
    >
      <i :class="themeStore.isDark ? 'fas fa-file-export text-red-400' : 'fas fa-file-export text-red-600'"></i>
      Export
    </button>
  </div>
</div>



        <!-- Summary cards -->
<SalesStats />

        <!-- Charts -->
        <!-- <saleshistorychart /> -->

        <!-- Sales table -->
<salestable v-if="authStore.user && authStore.user.shop_id" 
            :shopId="authStore.user.shop_id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import SalesStats from './SalesStats.vue';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import TopNav from '@/components/dashboard/TopNav.vue';
import StatsCard from '@/components/dashboard/StatsCards.vue';
import saleshistorychart from './saleshistorychart.vue';
import salestable from './salestable.vue';
import { useAuthStore } from '@/stores/auth';
import { apiFetch } from '@/utils/api';
import { useThemeStore } from '@/stores/theme.js';

const themeStore = useThemeStore();
const salesData = ref([]);
const loading = ref(true);
const authStore = useAuthStore();

// Filters and sorting
const filters = ref({
  startDate: null,
  endDate: null,
});

const sort = ref({
  field: 'date',
  order: 'desc',
});

// Pagination
const currentPage = ref(1);
const pageSize = ref(20);

// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Format date to readable form
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    console.error('Invalid date format:', dateString);
    return 'Invalid Date';
  }
};

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value);
};

// Set sorting field and toggle order
const setSort = (field) => {
  if (sort.value.field === field) {
    sort.value.order = sort.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    sort.value.field = field;
    sort.value.order = 'desc';
  }
  currentPage.value = 1; // Reset to first page
};

// Reset filters to default (today)
const resetFilters = () => {
  const today = getTodayDate();
  filters.value = {
    startDate: today,
    endDate: today,
  };
  currentPage.value = 1;
};

// Filtered data based on date range
const filteredData = computed(() => {
  let data = [...salesData.value];

  // If no filters are set, default to today's sales
  if (!filters.value.startDate && !filters.value.endDate) {
    const today = getTodayDate();
    return data.filter((item) => {
      const itemDate = new Date(item.rawDate).toISOString().split('T')[0];
      return itemDate === today;
    });
  }

  // Apply date filter
  if (filters.value.startDate || filters.value.endDate) {
    const start = filters.value.startDate ? new Date(filters.value.startDate) : null;
    const end = filters.value.endDate ? new Date(filters.value.endDate) : null;

    // Normalize dates to start/end of day
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    data = data.filter((item) => {
      try {
        const itemDate = new Date(item.rawDate);
        return (!start || itemDate >= start) && (!end || itemDate <= end);
      } catch (e) {
        console.error('Date comparison error:', e);
        return true;
      }
    });
  }

  return data;
});

// Sorted data
const sortedData = computed(() => {
  const field = sort.value.field;
  const order = sort.value.order;

  return [...filteredData.value].sort((a, b) => {
    try {
      let valA = a[field];
      let valB = b[field];

      // Special handling for date sorting
      if (field === 'date') {
        valA = new Date(a.rawDate).getTime();
        valB = new Date(b.rawDate).getTime();
      }
      // Convert to numbers if sorting by numeric fields
      else if (['quantity', 'price', 'total'].includes(field)) {
        valA = Number(valA);
        valB = Number(valB);
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    } catch (e) {
      console.error('Sorting error:', e);
      return 0;
    }
  });
});

// Pagination
const totalPages = computed(() => {
  return Math.ceil(sortedData.value.length / pageSize.value);
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return sortedData.value.slice(start, start + pageSize.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Totals calculations
const pageTotalQuantity = computed(() => {
  return paginatedData.value.reduce((sum, item) => sum + Number(item.quantity), 0);
});

const pageTotalAmount = computed(() => {
  return paginatedData.value.reduce((sum, item) => sum + Number(item.total), 0);
});

const grandTotalQuantity = computed(() => {
  return filteredData.value.reduce((sum, item) => sum + Number(item.quantity), 0);
});

const grandTotalAmount = computed(() => {
  return filteredData.value.reduce((sum, item) => sum + Number(item.total), 0);
});

// Sales trends calculation
const salesTrends = computed(() => {
  const trendsMap = {};

  // Aggregate sales by date
  filteredData.value.forEach((sale) => {
    try {
      const dateObj = new Date(sale.rawDate);
      const dateStr = dateObj.toISOString().split('T')[0];

      if (!trendsMap[dateStr]) {
        trendsMap[dateStr] = 0;
      }
      trendsMap[dateStr] += sale.total;
    } catch (e) {
      console.error('Trend calculation error:', e);
    }
  });

  // Convert to array and sort by date
  let trends = Object.entries(trendsMap)
    .map(([date, total]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total,
      rawDate: date,
    }))
    .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));

  // Limit to 30 days for better visualization
  if (trends.length > 30) {
    trends = trends.slice(-30);
  }

  // Find max value for scaling
  const maxTotal = Math.max(...trends.map((t) => t.total), 1);

  // Add percentage for visualization
  return trends.map((t) => ({
    ...t,
    percent: (t.total / maxTotal) * 100,
  }));
});

// Only show trends if we have data
const showTrends = computed(() => {
  return salesTrends.value.length > 0 && !loading.value;
});

// Fetch sales data
onMounted(async () => {
  try {
    loading.value = true;
    const shop_id = authStore.getShopId();
    const response = await apiFetch(`/sales/saleshistory/${shop_id}`);

    // Process data with raw dates for filtering
    salesData.value = response.map((item) => {
      try {
        return {
          ...item,
          rawDate: item.date, // Preserve original date for filtering
          formattedDate: formatDate(item.date),
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

    // console.log('Sales data loaded:', salesData.value);
  } catch (err) {
    console.error('API Error:', err);
    salesData.value = [];
  } finally {
    loading.value = false;
  }
});

// Reset pagination when filters change
watch([filters, sort], () => {
  currentPage.value = 1;
});

// Stats data for StatsCard component
const stats = computed(() => [
  {
    title: 'Total Sales',
    value : '2356',
    storeKey: 'totalSales',
    icon: 'fas fa-shopping-cart',
    bgColor: 'bg-primary bg-opacity-10',
    textColor: 'text-gray-900',
    trendIcon: 'fas fa-arrow-up',
    trendColor: 'text-green-600',
    trendText: '12.5%',
  },
  {
    title: 'Transactions',
    value : '83756',
    storeKey: 'transactions',
    icon: 'fas fa-exchange-alt',
    bgColor: 'bg-blue-100',
    textColor: 'text-gray-900',
    trendIcon: 'fas fa-arrow-up',
    trendColor: 'text-green-600',
    trendText: '8.3%',
  },
  {
    title: 'Avg. Order Value',
    value : '1000',
    storeKey: 'avgOrderValue',
    icon: 'fas fa-dollar-sign',
    bgColor: 'bg-purple-100',
    textColor: 'text-gray-900',
    trendIcon: 'fas fa-arrow-up',
    trendColor: 'text-green-600',
    trendText: '3.2%',
  },
  {
    title: 'Refunds',
    value : '2001',
    storeKey: 'refunds',
    icon: 'fas fa-undo',
    bgColor: 'bg-red-100',
    textColor: 'text-gray-900',
    trendIcon: 'fas fa-arrow-up',
    trendColor: 'text-red-600',
    trendText: '2.1%',
  },
]);

</script>
