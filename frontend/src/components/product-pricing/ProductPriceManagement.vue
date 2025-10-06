<!-- front-end/views/productPriceManagement.vue --><template>
  <div class="container mx-auto px-4 py-8">
    <ProductHeader />
    <div v-if="store.isLoading" class="text-center py-8">
      <i class="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
      <p class="mt-2">Loading products...</p>
    </div>

    <div v-else-if="store.products.length === 0" class="text-center py-8">
      <p class="text-gray-500">No products found</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Product Info with Navigation -->
      <div class="p-6 border-b border-gray-200 relative">
        <div class="flex items-center justify-between mb-4">
          <button @click="store.previousProduct" :disabled="store.currentProductIndex === 0"
            class="p-2 hover:bg-gray-100 rounded-full">
            <i class="fas fa-chevron-left text-2xl text-gray-600"></i>
          </button>

          <div class="flex-1 mx-4">
            <div class="flex flex-col md:flex-row gap-6">
              <div class="md:w-1/4">


<!-- "imageUrl" -->
<div class="h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
 <img
      :src="productImageUrl"
      alt="Product Image"
      class="object-contain h-full w-full"
    />
  </div>

              </div>
              <div class="md:w-3/4">
                <h2 class="text-xl font-bold text-gray-800 mb-2">
                  ഉൽപ്പന്നം: <span class="font-normal">{{ store.currentProduct.name }}</span>
                </h2>
                <p class="text-gray-600 mb-4">
                  SKU: {{ store.currentProduct.sku }} | ബാർകോഡ്: {{ store.currentProduct.barcode }}
                </p>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">വിഭാഗം</label>
                    <p class="text-gray-900">{{ store.currentProduct.category }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">ബ്രാൻഡ്</label>
                    <p class="text-gray-900">{{ store.currentProduct.brand }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">യൂണിറ്റ്</label>
                    <p class="text-gray-900">{{ store.currentProduct.unit }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">സ്റ്റോക്ക്</label>
                    <p class="text-gray-900">{{ store.currentProduct.stock }} യൂണിറ്റ്</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button @click="store.nextProduct" :disabled="store.currentProductIndex === store.products.length - 1"
            class="p-2 hover:bg-gray-100 rounded-full">
            <i class="fas fa-chevron-right text-2xl text-gray-600"></i>
          </button>
        </div>

        <!-- Product Navigation Status -->
        <div class="text-center text-sm text-gray-500 mt-2">
          ഉൽപ്പന്നം {{ store.currentProductIndex + 1 }} / {{ store.products.length }}
        </div>
      </div>

      <!-- Tabs with Product Context -->
      <PriceTabs :activeTab="store.activeTab" @tab-change="changeTab" :product-id="store.currentProduct.id" />

      <div class="p-6">
        <component :is="activeTabComponent" :key="store.currentProduct.id + store.activeTab" />
      </div>
    </div>

    <!-- Floating Action Button -->
    <!-- <button 
      id="quickEditBtn" 
      class="fab bg-blue-600 text-white hover:bg-blue-700"
      @click="store.toggleQuickEditSidebar"
    >
      <i class="fas fa-pencil-alt text-xl"></i>
    </button> -->
    <!--     
    <QuickEditSidebar /> -->
  </div>
</template>


<script setup>
import { computed, onMounted , ref} from 'vue';
import { useProductPricingStore } from '@/stores/ProductAndPricingStore';
import ProductHeader from '@/components/product-pricing/ProductHeader.vue';
import PriceTabs from '@/components/product-pricing/PriceTabs.vue';
import BasePrice from '@/components/product-pricing/BasePrice.vue';
import ShopPrices from '@/components/product-pricing/ShopPrices.vue';
import BulkPricing from '@/components/product-pricing/BulkPricing.vue';
import PriceHistory from '@/components/product-pricing/PriceHistory.vue';
import QuickEditSidebar from '@/components/product-pricing/QuickEditSidebar.vue';

const store = useProductPricingStore();

const imageUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_API_URL
  const image = store.currentProduct.image
  return image ? `${baseUrl}/${image}` : '/placeholder.png'
})
// Fetch products on component mount
onMounted(async () => {
  try {
    await store.fetchProducts();
  } catch (error) {
    console.error('Failed to load products:', error);
  }
});

const activeTabComponent = computed(() => {
  switch (store.activeTab) {
    case 'base-price': return BasePrice;
    case 'shop-prices': return ShopPrices;
    case 'bulk-pricing': return BulkPricing;
    case 'price-history': return PriceHistory;
    default: return BasePrice;
  }
});

const changeTab = (tab) => {
  store.setActiveTab(tab);
};
</script>