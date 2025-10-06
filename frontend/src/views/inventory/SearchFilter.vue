<template>
  <div class="glass-card rounded-xl p-6 mb-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="relative flex-grow">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-500"></i>
        </div>
        <input 
          type="text" 
          v-model="searchQuery"
          class="input-futuristic w-full pl-10 pr-4 py-3 rounded-lg" 
          placeholder="Search products by name or SKU..."
          @keyup.enter="applyFilters"
        >
      </div>
      <div class="flex space-x-3">
        <select v-model="selectedCategory" class="input-futuristic py-3 px-4 rounded-lg">
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="groceries">Groceries</option>
        </select>
        <select v-model="selectedStatus" class="input-futuristic py-3 px-4 rounded-lg">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="discontinued">Discontinued</option>
        </select>
        <button @click="applyFilters" class="btn-secondary px-6 py-3 rounded-lg">
          <i class="fas fa-filter mr-2"></i> Filter
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchFilter',
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      selectedStatus: ''
    }
  },
  methods: {
    applyFilters() {
      this.$emit('apply-filters', {
        search: this.searchQuery.trim(),
        category: this.selectedCategory,
        status: this.selectedStatus
      })
    }
  }
}
</script>