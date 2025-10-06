// composables/useInventory.js
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';
import debounce from 'lodash/debounce';
import { reactive, watch, toRefs } from 'vue';

export default function useInventory() {
  const { t } = useI18n();
  const authStore = useAuthStore();

  const state = reactive({
    inventory: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
    },
    filters: {
      search: '',
      category: '',
      status: '',
      sortBy: 'updated_at',
      sortDir: 'desc',
    },
    categories: [],
    statuses: [],
  });

  const fetchInventory = async ({ shop_id } = {}) => {
    state.loading = true;
    state.error = null;

    try {
      const params = new URLSearchParams({
        ...state.filters,
        page: state.pagination.currentPage,
        per_page: state.pagination.perPage,
      });
      if (shop_id) params.append('shop_id', shop_id);

      const response = await authStore.apiFetch(`/v1/inventory?${params.toString()}`);
      state.inventory = response.data;
      state.pagination = response.meta?.pagination || state.pagination;
    } catch (err) {
      state.error = err.message || 'Failed to load inventory';
    } finally {
      state.loading = false;
    }
  };

  const handleSort = (column) => {
    if (state.filters.sortBy === column) {
      state.filters.sortDir = state.filters.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      state.filters.sortBy = column;
      state.filters.sortDir = 'asc';
    }
    fetchInventory();
  };

  const handlePageChange = (page) => {
    state.pagination.currentPage = page;
    fetchInventory();
  };

  const resetFilters = () => {
    state.filters.search = '';
    state.filters.category = '';
    state.filters.status = '';
    fetchInventory();
  };

  watch(
    () => [state.filters.search, state.filters.category, state.filters.status],
    debounce(() => {
      state.pagination.currentPage = 1;
      fetchInventory();
    }, 500)
  );

  return {
    ...toRefs(state),
    fetchInventory,
    handleSort,
    handlePageChange,
    resetFilters,
  };
}
