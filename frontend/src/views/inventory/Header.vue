<template>
  <header class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
    <div>
      <!-- <h1 class="text-3xl font-bold font-futuristic mb-2">{{ shopname }} - Inventory</h1> -->
      <p class="text-gray-400">Manage your products and stock levels</p>
    </div>
    <div class="mt-4 md:mt-0">
      <button @click="addProduct" class="btn-primary px-6 py-3 rounded-lg font-medium flex items-center">
        <i class="fas fa-plus mr-2"></i> Add Product
      </button>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'InventoryHeader',

  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const shopname = computed(() => authStore.activeShopName || 'MyShop');

    function addProduct() {
      router.push('/products/add');
    }

    return {
      shopname,
      addProduct
    };
  }
});
</script>

