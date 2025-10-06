<template>
  <div class="container">
    <div class="controls">
      <div class="search-container">
        <i class="fas fa-search"></i>
        <input
          v-model="searchTerm"
          type="text"
          class="search-input"
          placeholder="Search across all columns..."
        />
      </div>

      <div class="page-size-selector">
        <span>Show:</span>
        <select v-model="pageSize" @change="goToPage(1)">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
        <span>entries</span>
      </div>
    </div>

    <div class="table-wrapper">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <div class="table-container">
        <table class="advanced-table">
          <thead>
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                @click="sortTable(column.key)"
                :class="{
                  'sort-asc': sortColumn === column.key && sortDirection === 'asc',
                  'sort-desc': sortColumn === column.key && sortDirection === 'desc'
                }"
              >
                {{ column.title }}
              </th>
            </tr>
          </thead>
          <tbody v-if="paginatedData.length">
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ item.id }}</td>
              <td>
                <div class="font-semibold">{{ item.name }}</div>
                <div class="text-sm text-gray-500">{{ item.email }}</div>
              </td>
              <td>{{ item.company }}</td>
              <td>{{ item.role }}</td>
              <td>{{ formatDate(item.joinDate) }}</td>
              <td>${{ item.salary.toLocaleString() }}</td>
              <td>
                <span :class="`status-badge status-${item.status}`">{{ item.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="!filteredData.length && !loading" class="empty-state">
          <i class="fas fa-database"></i>
          <h3>No matching records found</h3>
          <p>Try adjusting your search query</p>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <div class="pagination-info">
        Showing {{ (currentPage - 1) * pageSize + 1 }} to
        {{ Math.min(currentPage * pageSize, filteredData.length) }} of
        {{ filteredData.length }} records
      </div>

      <div class="pagination-controls">
        <button class="pagination-btn" @click="goToPage(1)" :disabled="currentPage === 1">
          <i class="fas fa-angle-double-left"></i>
        </button>
        <button class="pagination-btn" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
          <i class="fas fa-angle-left"></i>
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          class="pagination-btn"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button class="pagination-btn" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
          <i class="fas fa-angle-right"></i>
        </button>
        <button class="pagination-btn" @click="goToPage(totalPages)" :disabled="currentPage === totalPages">
          <i class="fas fa-angle-double-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Data
const tableData = ref([]);

// Columns
const columns = ref([
  { key: 'id', title: 'ID' },
  { key: 'name', title: 'Employee' },
  { key: 'company', title: 'Company' },
  { key: 'role', title: 'Role' },
  { key: 'joinDate', title: 'Join Date' },
  { key: 'salary', title: 'Salary' },
  { key: 'status', title: 'Status' }
]);

// State
const searchTerm = ref('');
const sortColumn = ref('id');
const sortDirection = ref('asc');
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(true);

// Format Date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Simulate fetching data
const fetchData = () => {
  loading.value = true;
  setTimeout(() => {
    tableData.value = [...Array(15)].map((_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      company: ['Tech Innovations', 'Digital Solutions', 'Cloud Services'][i % 3],
      role: ['Developer', 'Designer', 'Analyst'][i % 3],
      joinDate: `202${i % 5}-0${(i % 9) + 1}-1${i % 9}`,
      salary: 60000 + i * 5000,
      status: ['active', 'inactive', 'pending'][i % 3]
    }));
    loading.value = false;
  }, 1000);
};

// Search Filter
const filteredData = computed(() => {
  if (!searchTerm.value) return tableData.value;
  return tableData.value.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  );
});

// Sorting
const sortedData = computed(() => {
  return [...filteredData.value].sort((a, b) => {
    const valA = a[sortColumn.value];
    const valB = b[sortColumn.value];

    if (sortColumn.value === 'joinDate') {
      return sortDirection.value === 'asc'
        ? new Date(valA) - new Date(valB)
        : new Date(valB) - new Date(valA);
    }

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection.value === 'asc' ? valA - valB : valB - valA;
    }

    return sortDirection.value === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });
});

// Pagination
const totalPages = computed(() =>
  Math.ceil(sortedData.value.length / pageSize.value)
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return sortedData.value.slice(start, start + pageSize.value);
});

const visiblePages = computed(() => {
  const maxPages = 5;
  const total = totalPages.value;
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  let end = Math.min(total, start + maxPages - 1);
  if (end - start < maxPages - 1) start = Math.max(1, end - maxPages + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const sortTable = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
  currentPage.value = 1;
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(() => fetchData());
</script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .header h1 {
      font-size: 1.8rem;
      font-weight: 600;
    }
    
    .header p {
      font-size: 1rem;
      opacity: 0.9;
      max-width: 600px;
    }
    
    .controls {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
      background: white;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .search-container {
      position: relative;
      flex-grow: 1;
      max-width: 400px;
    }
    
    .search-container i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }
    
    .search-input {
      width: 100%;
      padding: 12px 20px 12px 45px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: white;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }
    
    .page-size-selector {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .page-size-selector select {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      background: white;
      font-size: 0.9rem;
    }
    
    .table-container {
      overflow-x: auto;
      padding: 20px;
    }
    
    .advanced-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }
    
    .advanced-table th {
      background-color: #f1f5f9;
      color: #334155;
      font-weight: 600;
      text-align: left;
      padding: 16px 20px;
      border-bottom: 2px solid #e2e8f0;
      cursor: pointer;
      user-select: none;
      position: relative;
      transition: all 0.2s ease;
    }
    
    .advanced-table th:hover {
      background-color: #e2e8f0;
    }
    
    .advanced-table th.sort-asc::after,
    .advanced-table th.sort-desc::after {
      content: '';
      position: absolute;
      right: 15px;
      border-width: 0 5px 5px 5px;
      border-style: solid;
      border-color: transparent transparent #3b82f6 transparent;
    }
    
    .advanced-table th.sort-desc::after {
      border-width: 5px 5px 0 5px;
      border-color: #3b82f6 transparent transparent transparent;
    }
    
    .advanced-table td {
      padding: 14px 20px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    
    .advanced-table tr:last-child td {
      border-bottom: none;
    }
    
    .advanced-table tr:hover td {
      background-color: #f8fafc;
    }
    
    .status-badge {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    
    .status-active {
      background-color: #dcfce7;
      color: #166534;
    }
    
    .status-pending {
      background-color: #fef9c3;
      color: #854d0e;
    }
    
    .status-inactive {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-top: 1px solid #e2e8f0;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .pagination-info {
      color: #64748b;
      font-size: 0.95rem;
    }
    
    .pagination-controls {
      display: flex;
      gap: 8px;
    }
    
    .pagination-btn {
      padding: 8px 16px;
      background-color: white;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .pagination-btn:hover:not(:disabled) {
      background-color: #f1f5f9;
      border-color: #94a3b8;
    }
    
    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .pagination-btn.active {
      background-color: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }
    
    .empty-state {
      padding: 40px 20px;
      text-align: center;
      color: #64748b;
    }
    
    .empty-state i {
      font-size: 3rem;
      margin-bottom: 15px;
      color: #cbd5e1;
    }
    
    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: #334155;
    }
    
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
    }
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #e2e8f0;
      border-top: 5px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .table-wrapper {
      position: relative;
      min-height: 300px;
    }
    
    .api-info {
      background: #f1f5f9;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }
    
    .api-info h3 {
      margin-bottom: 10px;
      color: #334155;
    }
    
    .api-info pre {
      background: white;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      overflow-x: auto;
      font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
      .controls {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .search-container {
        max-width: 100%;
        width: 100%;
      }
      
      .pagination {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .pagination-controls {
        flex-wrap: wrap;
      }
    }
  </style>