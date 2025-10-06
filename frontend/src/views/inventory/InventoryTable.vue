<!-- src/views/inventory/inventoryTable.vue -->
<template>
  <div class="glass-card rounded-xl overflow-hidden mb-8"
    :class="theme.isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-800 data-table">
        <thead :class="theme.isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'">
          <tr>
            <th v-for="column in columns" :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody :class="theme.isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'">
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-6 py-4 text-center">
              <i class="fas fa-spinner fa-spin text-gray-500"></i>
              Loading inventory...
            </td>
          </tr>

          <tr v-for="(item, index) in items" :key="index"
            :class="theme.isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">

                  <img v-if="item.image" :src="item.image.startsWith('http') ? item.image : `${IMG_URL}/${item.image}`"
                    alt="Product Image" class="object-cover h-full w-full"
                    @error="console.error('Image load error:', item.image)" />
                  <i v-else class="fas fa-box text-gray-500"></i>

                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium">{{ item.name }}</div>
                  <div class="text-xs text-gray-400">{{ item.sku }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.sku }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.category }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.stock }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">{{ formatPrice(item.price) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[statusClass(item), theme.isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800']"
                class="px-2 py-1 text-xs rounded-full">
                {{ statusLabel(item) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
              {{ formatDate(item.updated_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button v-if="userRole === 'owner'" class="text-indigo-400 hover:text-indigo-300 mr-3"
                @click="openEditModal(item)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="text-purple-400 hover:text-purple-300">
                <i class="fas fa-chart-line"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Product Modal -->
    <div v-if="isModalVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div :class="theme.isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'" class="p-6 rounded-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Edit Product</h3>
        <form @submit.prevent="saveEdit">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium">Product Name</label>
            <input v-model="editedProduct.name" id="name" type="text"
              :class="theme.isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'"
              class="mt-1 block w-full px-3 py-2 border rounded-md" required />
          </div>
          <div class="mb-4">
            <label for="sku" class="block text-sm font-medium">SKU</label>
            <input v-model="editedProduct.sku" id="sku" type="text"
              :class="theme.isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'"
              class="mt-1 block w-full px-3 py-2 border rounded-md" required />
          </div>
          <div class="mb-4">
            <label for="price" class="block text-sm font-medium">Price</label>
            <input v-model="editedProduct.price" id="price" type="number"
              :class="theme.isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'"
              class="mt-1 block w-full px-3 py-2 border rounded-md" required />
          </div>
          <div class="mb-4">
            <label for="status" class="block text-sm font-medium">Status</label>
            <select v-model="editedProduct.status" id="status"
              :class="theme.isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'"
              class="mt-1 block w-full px-3 py-2 border rounded-md" required>
              <option value="active">Active</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

          <div class="mb-4">
            <label for="stock" class="block text-sm font-medium">Stock</label>
            <input v-model="editedProduct.stock" id="stock" type="number"
              :class="theme.isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'"
              class="mt-1 block w-full px-3 py-2 border rounded-md" required />
          </div>
          <div class="flex justify-end">
            <button type="submit"
              :class="theme.isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-500 hover:bg-indigo-400 text-white'"
              class="px-4 py-2 rounded-md">
              Save
            </button>
            <button type="button" @click="closeEditModal"
              :class="theme.isDark ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-300 hover:bg-gray-200 text-gray-700'"
              class="ml-2 px-4 py-2 rounded-md">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/stores/auth';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useThemeStore } from '@/stores/theme';

export default {
  name: 'InventoryTable',
  props: {
    filters: {
      type: Object,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },
  setup() {
    const inventoryStore = useInventoryStore();
    const authStore = useAuthStore();
    const theme = useThemeStore();
    const IMG_URL = import.meta.env.VITE_IMG_URL;   // ✅ IMAGE URL from environment variables
    return { inventoryStore, authStore, theme , IMG_URL};
  },
  data() {
    return {
      columns: [
        { key: 'product', label: 'Product' },
        { key: 'sku', label: 'SKU' },
        { key: 'category', label: 'Category' },
        { key: 'stock', label: 'Stock' },
        { key: 'price', label: 'Price' },
        { key: 'status', label: 'Status' },
        { key: 'updated', label: 'Last Updated' },
        { key: 'actions', label: 'Actions' }
      ],
      isModalVisible: false,
      editedProduct: null
    };
  },
  computed: {
    items() {
      return this.inventoryStore.items;
    },
    loading() {
      return this.inventoryStore.loading;
    },
    userRole() {
      const authStore = useAuthStore();
      return authStore.user?.role || null;
    }
  },
  watch: {
    filters: {
      handler() {
        this.loadInventory();
      },
      deep: true,
      immediate: true
    },
    currentPage() {
      this.loadInventory();
    }
  },
  methods: {
    async loadInventory() {
      try {
        // Ensure activeShop is available
        const shopId = this.authStore?.activeShop;
        if (!shopId) return;

        // Call the refactored fetchInventory with proper params
        await this.inventoryStore.fetchInventory({
          shopId,
          search: this.filters.search || '',
          category: this.filters.category || '',
          status: this.filters.status || '',
          page: this.currentPage || 1
        });

        // Emit total pages to parent component, if applicable
        this.$emit('update-total-pages', this.inventoryStore.totalPages);

      } catch (error) {
        console.error('Error loading inventory:', error);
      }
    },

    statusClass(item) {
      if (item.archived) return 'status-discontinued';

      switch (item.status) {
        case 'active':
          return 'status-active';
        case 'out_of_stock':
          return 'status-out';
        case 'discontinued':
          return 'status-discontinued';
        default:
          return item.stock <= 0 ? 'status-out' : 'status-active';
      }
    },

    statusLabel(item) {
      console.log('StatusLabel Init → item.status:', item.status);

      switch (item.status) {
        case 'active':
          return 'Active';
        case 'out_of_stock':
          return 'Out of Stock';
        case 'discontinued':
          return 'Discontinued';
        default:
          return item.stock <= 0 ? 'Out of Stock' : 'Active';
      }
    },


    formatPrice(price) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR'
      }).format(price);
    },
    formatDate(dateString) {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    },
    openEditModal(item) {
      this.editedProduct = {
        ...item,
        id: item.shop_product_id
      };
      this.isModalVisible = true;
    },
    closeEditModal() {
      this.isModalVisible = false;
      this.editedProduct = null;
    },
    async saveEdit() {
      try {
        const authStore = useAuthStore();
        await this.inventoryStore.updateItem({
          id: this.editedProduct.id,
          shopId: authStore.activeShop,
          data: {
            price: this.editedProduct.price,
            stock: this.editedProduct.stock,
            status: this.editedProduct.status,
          }
        });
        this.closeEditModal();
      } catch (error) {
        console.error('Error saving product:', error);
      }
    }
  }
};
</script>