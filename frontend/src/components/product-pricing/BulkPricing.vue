<!--front-end/src/components/product-pricing/BulkPricing.vue-->
<template>
  <div>
    <h3 class="text-lg font-bold text-gray-800 mb-4">ബൾക്ക് വിലനിർണ്ണയം</h3>
    
    <div class="mb-6">
      <!-- Enable Toggle -->
      <div class="flex items-center mb-4">
        <input 
          type="checkbox" 
          id="enableBulkPricing" 
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          v-model="store.bulkPricingEnabled"
          @change="store.toggleBulkPricing"
        >
        <label for="enableBulkPricing" class="ml-2 block text-sm text-gray-700 font-medium">
          ബൾക്ക് വിലനിർണ്ണയം പ്രവർത്തനക്ഷമമാക്കുക
        </label>
      </div>
      
      <p class="text-sm text-gray-500 mb-6">
        ബൾക്ക് വിലനിർണ്ണയം നിങ്ങളെ അളവ് അടിസ്ഥാനമാക്കി വ്യത്യസ്ത വിലകൾ സജ്ജീകരിക്കാൻ അനുവദിക്കുന്നു (ഉദാ: കൂടുതൽ വാങ്ങുമ്പോൾ കൂടുതൽ ഡിസ്കൗണ്ട്).
      </p>
      
      <!-- Bulk Pricing Table -->
      <div class="overflow-x-auto">
        <table :class="['min-w-full divide-y divide-gray-200', !store.bulkPricingEnabled ? 'opacity-50' : '']">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ഏറ്റവും കുറഞ്ഞ അളവ്</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ഏറ്റവും കൂടിയ അളവ്</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">റീട്ടെയിൽ വില</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ഹോൾസെയിൽ വില</th>
              <th class="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(tier, index) in store.bulkPricingTiers" :key="index">
              <td class="px-6 py-4 whitespace-nowrap">
                <input 
                  type="number" 
                  class="w-20 px-3 py-1 border border-gray-300 rounded input-highlight" 
                  v-model="tier.min"
                  :disabled="!store.bulkPricingEnabled"
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <input 
                  type="number" 
                  class="w-20 px-3 py-1 border border-gray-300 rounded input-highlight" 
                  v-model="tier.max"
                  :disabled="!store.bulkPricingEnabled"
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="mr-1">₹</span>
                  <input 
                    type="number" 
                    class="w-24 px-3 py-1 border border-gray-300 rounded input-highlight" 
                    v-model="tier.retail"
                    :disabled="!store.bulkPricingEnabled"
                  >
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="mr-1">₹</span>
                  <input 
                    type="number" 
                    class="w-24 px-3 py-1 border border-gray-300 rounded input-highlight" 
                    v-model="tier.wholesale"
                    :disabled="!store.bulkPricingEnabled"
                  >
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  class="text-red-600 hover:text-red-900"
                  @click="store.removeBulkPricingTier(index)"
                  :disabled="!store.bulkPricingEnabled"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Add Tier Button -->
      <button 
        class="mt-4 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-50"
        @click="store.addBulkPricingTier"
        :disabled="!store.bulkPricingEnabled"
      >
        <i class="fas fa-plus mr-2"></i> പുതിയ ടയർ ചേർക്കുക
      </button>

      <!-- Save Button -->
      <div class="mt-6">
        <button 
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          @click="saveBulkPricing"
          :disabled="!store.bulkPricingEnabled"
        >
          <i class="fas fa-save mr-2"></i> സംരക്ഷിക്കുക
        </button>
      </div>
    </div>
    
    <!-- Info Message -->
    <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-info-circle text-blue-500"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm text-blue-700">
            ബൾക്ക് വിലനിർണ്ണയം ഓർഡർ സിസ്റ്റത്തിൽ മാത്രമേ പ്രവർത്തിക്കൂ. POS സിസ്റ്റത്തിൽ ഇത് പ്രവർത്തിക്കില്ല.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watchEffect } from 'vue'
import { useProductPricingStore } from '@/stores/ProductAndPricingStore'
import { apiFetch } from '@/utils/api'

const store = useProductPricingStore()

// Load bulk pricing when product changes
watchEffect(async () => {
  if (store.currentProduct.id) {
    const response = await apiFetch(`/pricing/products/${store.currentProduct.id}/bulk-pricing`)
    store.bulkPricingTiers = response
  }
})

// Save bulk pricing data
const saveBulkPricing = async () => {
  try {
    await apiFetch(`/pricing/products/${store.currentProduct.id}/bulk-pricing`, {
      method: 'PUT',
      body: JSON.stringify(store.bulkPricingTiers)
    })
    alert('ബൾക്ക് വിലനിർണ്ണയം വിജയകരമായി സംരക്ഷിച്ചു!')
  } catch (error) {
    console.error('Save failed:', error)
    alert('സംരക്ഷിക്കാൻ കഴിയില്ല. വീണ്ടും ശ്രമിക്കുക.')
  }
}
</script>

<style scoped>
.input-highlight:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb;
}
</style>
