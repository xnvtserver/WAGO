<template>
  <div
    class="flex h-screen overflow-hidden"
    :class="theme.isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'"
  >
    <!-- Sidebar -->
    <SideBar />

    <!-- Main Content Area -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Mobile Header -->
      <MobileHeader />

      <!-- Content Area -->
      <main
        class="flex-1 overflow-auto p-4 md:p-8 transition-colors duration-300"
        :class="theme.isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'"
      >
        <div class="max-w-7xl mx-auto">
          <Header />
          <!-- <DashboardStats /> -->
<SearchFilter @apply-filters="handleFilterChange" />
  <InventoryTable
    ref="inventoryTable"
    :filters="activeFilters"
    :current-page="currentPage"
  />
  <Pagination
    :current-page="currentPage"
    :total-pages="totalPages"
    @page-change="handlePageChange"
  />
        </div>
      </main>
    </div>
  </div>
</template>


<script>
import { useThemeStore } from '@/stores/theme';
import { useAuthStore } from '@/stores/auth';
import SideBar from './SideBar.vue';
import MobileHeader from './MobileHeader.vue';
import Header from './Header.vue';
import DashboardStats from './DashboardStats.vue';
import SearchFilter from './SearchFilter.vue';
import InventoryTable from './InventoryTable.vue';
import Pagination from './Pagination.vue';

export default {
  components: {
    SideBar,
    MobileHeader,
    Header,
    DashboardStats,
    SearchFilter,
    InventoryTable,
    Pagination
  },
  data() {
    return {
      activeFilters: {
        search: '',
        category: '',
        status: ''
      },
      currentPage: 1,
      totalPages: 1, // This can be updated based on inventory API response
      theme: useThemeStore()
    };
  },
  mounted() {
    this.theme.initTheme();
    const authStore = useAuthStore();
    if (authStore.activeShop) {
      // Optional shop-specific logic
    }
  },
  methods: {
    handleFilterChange(filters) {
      this.activeFilters = { ...filters };
      this.currentPage = 1;
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
    }
  }
};
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap');

:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --secondary: #10b981;
  --dark: #0f172a;
  --light: #f1f1f8;
  --accent: #8b5cf6;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #f1f1f1;
  color: #111827;
}
</style>
