<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Low Stock Products</h2>
      <div class="relative w-64">
        <input v-model="searchTerm" type="text" placeholder="Search products..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="col in columns" :key="col.key" scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                :class="{ 'hover:bg-gray-100': col.sortable }" @click="col.sortable ? sortTable(col.key) : null">
                <div class="flex items-center">
                  {{ col.title }}
                  <span v-if="col.sortable" class="ml-1">
                    <svg v-if="sortColumn === col.key && sortDirection === 'asc'" class="h-4 w-4" fill="none"
                      stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                    <svg v-else-if="sortColumn === col.key && sortDirection === 'desc'" class="h-4 w-4" fill="none"
                      stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in tableData" :key="index" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img v-if="item.product_image" :src="item.product_image"
                    class="w-10 h-10 rounded-full object-cover mr-4">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ item.product_name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.sku }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.barcode }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                  'bg-red-100 text-red-800': item.stock < item.reorder_threshold * 0.5,
                  'bg-yellow-100 text-yellow-800': item.stock >= item.reorder_threshold * 0.5
                }">
                  {{ item.stock }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.reorder_threshold }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatCurrency(item.retail_price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatCurrency(item.wholesale_price) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-if="tableData.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No low stock products</h3>
        <p class="mt-1 text-sm text-gray-500">All products are above reorder thresholds</p>
      </div>

      <!-- Pagination -->
      <div v-if="tableData.length > 0"
        class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(currentPage * pageSize, total) }}</span>
              of
              <span class="font-medium">{{ total }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>

              <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[currentPage === page
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium']">
                {{ page }}
              </button>

              <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import { apiFetch } from '@/utils/api.js'; // Adjust path as needed
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const authToken = computed(() => authStore.token); // assuming you store token as `token`

// Data
const tableData = ref([]);
const total = ref(0);

// Columns
const columns = ref([
  { key: 'product_name', title: 'Product', sortable: true },
  { key: 'sku', title: 'SKU', sortable: true },
  { key: 'barcode', title: 'Barcode' },
  { key: 'stock', title: 'Current Stock', sortable: true },
  { key: 'reorder_threshold', title: 'Reorder At' },
  { key: 'retail_price', title: 'Retail Price', sortable: true },
  { key: 'wholesale_price', title: 'Wholesale Price', sortable: true },
]);

// State
const searchTerm = ref('');
const sortColumn = ref('stock');
const sortDirection = ref('asc');
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(true);
const totalPages = ref(1);

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(value);
};

// Fetch data from API
const fetchData = async () => {
  loading.value = true;

  try {
    const params = new URLSearchParams({
      page: currentPage.value,
      pageSize: pageSize.value,
      sortBy: sortColumn.value,
      sortOrder: sortDirection.value,
      search: searchTerm.value
    });

const response = await apiFetch(`/inv/low-stock-product-of-our-shop/?${params.toString()}`, {
  headers: {
    Authorization: `Bearer ${authToken.value}`
  }
});

    tableData.value = response.data;
    total.value = response.total;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error('Error fetching low stock products:', error);
  } finally {
    loading.value = false;
  }
};


// Pagination controls
const visiblePages = computed(() => {
  const maxPages = 5;
  const pages = [];
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  let endPage = startPage + maxPages - 1;

  if (endPage > totalPages.value) {
    endPage = totalPages.value;
    startPage = Math.max(1, endPage - maxPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const sortTable = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Watchers
watch([currentPage, pageSize, sortColumn, sortDirection, searchTerm], () => {
  fetchData();
});

// Initial fetch
onMounted(fetchData);
</script>