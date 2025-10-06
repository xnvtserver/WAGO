<template>
  <div class="flex items-center justify-between glass-card px-6 py-4 rounded-lg">
    <div class="text-sm text-gray-400">
      Page {{ currentPage }} of {{ totalPages }}
    </div>
    <div class="flex space-x-1 pagination">
      <button
        class="page-item px-4 py-2 rounded-lg"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        class="page-item px-4 py-2 rounded-lg"
        :class="{ 'bg-indigo-500 text-white': currentPage === page }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>

      <button
        class="page-item px-4 py-2 rounded-lg"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  methods: {
    changePage(page) {
      if (page !== this.currentPage && page > 0 && page <= this.totalPages) {
        this.$emit('page-change', page);
      }
    }
  }
};
</script>
