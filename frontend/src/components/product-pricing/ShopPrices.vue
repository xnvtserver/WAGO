<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-bold text-gray-800">ഷോപ്പ് വിലകൾ</h3>
      <div class="flex items-center">
        <div class="relative">
          <input type="text" placeholder="ഷോപ്പ് തിരയുക..." class="pl-8 pr-4 py-2 border border-gray-300 rounded-md input-highlight">
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
        <button class="ml-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
          <i class="fas fa-filter mr-2"></i> ഫിൽട്ടർ
        </button>
      </div>
    </div>
    
    <div class="scrollable-container overflow-x-auto pb-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" style="min-width: max-content;">
        <div 
          v-for="shop in store.shops" 
          :key="shop.id"
          class="shop-card bg-white border border-gray-200 rounded-lg p-4 w-80 flex-shrink-0"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h4 class="font-bold text-gray-800">{{ shop.name }}</h4>
              <p class="text-sm text-gray-600">{{ shop.location }}</p>
            </div>
<span 
  :class="[ 
    'text-xs px-2 py-1 rounded', 
    shop.status === 'active' ? 'bg-green-100 text-green-800' : 
    // shop.status === 'needs-update' ? 'bg-yellow-100 text-yellow-800' : 
    shop.status === 'out_of_stock' ? 'bg-orange-100 text-orange-800' :
    'bg-red-100 text-red-800' 
  ]"
>
  {{
    shop.status === 'active' ? 'സജീവം' :
    // shop.status === 'needs-update' ? 'അപ്ഡേറ്റ് ആവശ്യമാണ്' :
    shop.status === 'out_of_stock' ? 'സ്റ്റോക്ക് ഇല്ല' :
    'നിർത്തിവെച്ചു'
  }}
</span>

          </div>
          
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">റീട്ടെയിൽ വില</label>
              <div class="flex items-center">
                <span class="mr-2 text-gray-500">₹</span>
                <input 
                  type="number" 
                  class="w-full px-2 py-1 border border-gray-300 rounded input-highlight" 
                  v-model="shop.retail_price"
                  :disabled="shop.status === 'inactive'"
                  @blur="updateShopPrice(shop)"
                >
              </div>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">ഹോൾസെയിൽ വില</label>
              <div class="flex items-center">
                <span class="mr-2 text-gray-500">₹</span>
                <input 
                  type="number" 
                  class="w-full px-2 py-1 border border-gray-300 rounded input-highlight" 
                  v-model="shop.wholesale_price "
                  :disabled="shop.status === 'inactive'"
                  @blur="updateShopPrice(shop)"
                >
              </div>
            </div>
            
            <div class="flex justify-between text-xs">
              <span class="text-gray-500">അവസാനം അപ്ഡേറ്റ് ചെയ്തത്: {{ shop.lastUpdated }}</span>
              <button class="text-blue-600 hover:text-blue-800" @click="updateShopPrice(shop)">
                <i class="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
        </div>
        <router-link to="/createShop">
        <div class="shop-card bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 w-80 flex-shrink-0 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
          
          <div class="text-center">
            <i class="fas fa-plus-circle text-3xl text-gray-400 mb-2"></i>
            <p class="text-gray-600 font-medium">പുതിയ ഷോപ്പ് ചേർക്കുക</p>
          </div>
          
        </div></router-link>
      </div>
    </div>
    
    <div class="bg-gray-50 p-4 rounded-lg">
      <h4 class="font-bold text-gray-800 mb-3">ബാച്ച് അപ്ഡേറ്റ്</h4>
      <div class="grid md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">എല്ലാ ഷോപ്പുകൾക്കും റീട്ടെയിൽ വില</label>
          <div class="flex items-center">
            <span class="mr-2 text-gray-500">₹</span>
            <input 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 rounded input-highlight" 
              placeholder="പുതിയ വില"
              v-model="store.batchUpdate.retail"
            >
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">എല്ലാ ഷോപ്പുകൾക്കും ഹോൾസെയിൽ വില</label>
          <div class="flex items-center">
            <span class="mr-2 text-gray-500">₹</span>
            <input 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 rounded input-highlight" 
              placeholder="പുതിയ വില"
              v-model="store.batchUpdate.wholesale"
            >
          </div>
        </div>
        <div class="flex items-end">
          <button 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            @click="store.updateBatchPrices"
          >
            <i class="fas fa-save mr-2"></i> എല്ലാം അപ്ഡേറ്റ് ചെയ്യുക
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProductPricingStore } from '@/stores/ProductAndPricingStore'
import { apiFetch } from '@/utils/api' // Adjust the path if needed

const store = useProductPricingStore()

const updateShopPrice = async (shop) => {
  try {
    await apiFetch(`/ProductAndPricingRoutes/pricing/products/${store.currentProduct.id}/shop-price`, {
      method: 'PUT',
      body: JSON.stringify({
        shopId: shop.id,
        retail_price: shop.retailPrice,
        wholesale_price: shop.wholesalePrice
      }),
    });
    await store.fetchProductDetails(store.currentProduct.id);
  } catch (error) {
    console.error('Failed to update shop price:', error);
  }
}

</script>
