<!--front-end/src/components/product-pricing/PriceHistory.vue-->
<template>
  <div>
    <h3 class="text-lg font-bold text-gray-800 mb-4">വില ചരിത്രം</h3>
    
    <div class="mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div class="mb-2 md:mb-0">
          <label class="block text-sm font-medium text-gray-700 mb-1">ഫിൽട്ടർ</label>
          <select class="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md input-highlight">
            <option value="all">എല്ലാം കാണിക്കുക</option>
            <option value="retail">റീട്ടെയിൽ വില മാറ്റങ്ങൾ</option>
            <option value="wholesale">ഹോൾസെയിൽ വില മാറ്റങ്ങൾ</option>
            <option value="purchase">വാങ്ങിയ വില മാറ്റങ്ങൾ</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">കാലയളവ്</label>
          <div class="flex space-x-2">
            <select class="w-24 px-3 py-2 border border-gray-300 rounded-md input-highlight">
              <option>01-06-2023</option>
              <option>15-05-2023</option>
              <option>01-05-2023</option>
            </select>
            <span class="flex items-center px-2">മുതൽ</span>
            <select class="w-24 px-3 py-2 border border-gray-300 rounded-md input-highlight">
              <option>15-06-2023</option>
              <option>30-05-2023</option>
              <option>15-05-2023</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">തീയതി</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">വില തരം</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">പഴയ വില</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">പുതിയ വില</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">മാറ്റം</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ഉപയോക്താവ്</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(history, index) in store.priceHistory" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ history.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" 
                  :class="history.type === 'retail' ? 'text-blue-600' : 
                         history.type === 'wholesale' ? 'text-green-600' : 'text-gray-600'">
                {{ history.type === 'retail' ? 'റീട്ടെയിൽ വില' : 
                   history.type === 'wholesale' ? 'ഹോൾസെയിൽ വില' : 'വാങ്ങിയ വില' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{{ history.oldPrice.toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{{ history.newPrice.toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="history.change.startsWith('+') ? 'text-red-600' : 'text-green-600'">
                {{ history.change }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ history.user }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watchEffect } from 'vue'
import { useProductPricingStore } from '@/stores/ProductAndPricingStore'

const store = useProductPricingStore()

watchEffect(async () => {
  if (store.currentProduct.id) {
    const response = await apiFetch(`/pricing/products/${store.currentProduct.id}/history`)
    store.priceHistory = response
  }
})
</script>