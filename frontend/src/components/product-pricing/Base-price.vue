<template>
  <div>
    <h3 class="text-lg font-bold text-gray-800 mb-4">അടിസ്ഥാന വില സജ്ജീകരണം</h3>
    
    <!-- Save Status Messages -->
    <div v-if="saveStatus === 'saving'" class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-spinner fa-spin text-blue-500"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm text-blue-700">സംരക്ഷിക്കുന്നു...</p>
        </div>
      </div>
    </div>

    <div v-if="saveStatus === 'success'" class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-check-circle text-green-500"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm text-green-700">{{ saveMessage }}</p>
        </div>
      </div>
    </div>

    <div v-if="saveStatus === 'error'" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-exclamation-circle text-red-500"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ saveMessage }}</p>
        </div>
      </div>
    </div>
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <!-- Purchase Price -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <i class="fas fa-shopping-cart mr-2 text-blue-600"></i> വാങ്ങിയ വില
        </label>
        <div class="flex items-center">
          <span class="mr-2 text-gray-500">₹</span>
          <input 
            type="number" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md input-highlight" 
            v-model="store.prices.purchase"
          >
          <span class="ml-2 text-gray-500">/യൂണിറ്റ്</span>
        </div>
        <p class="text-xs text-gray-500 mt-2">സപ്ലയർ വില (ചെലവ് വില)</p>
      </div>
      
      <!-- Retail Price -->
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <label class="block text-sm font-medium text-blue-700 mb-2">
          <i class="fas fa-tag mr-2 text-blue-600"></i> റീട്ടെയിൽ വില
        </label>
        <div class="flex items-center">
          <span class="mr-2 text-blue-500">₹</span>
          <input 
            type="number" 
            class="w-full px-3 py-2 border border-blue-300 rounded-md input-highlight bg-white" 
            v-model="store.prices.retail"
          >
          <span class="ml-2 text-blue-500">/യൂണിറ്റ്</span>
        </div>
        <div class="flex justify-between mt-2">
          <p class="text-xs text-blue-600">ലാഭം: ₹{{ store.retailProfit.toFixed(2) }}</p>
          <p class="text-xs text-blue-600">ലാഭ %: {{ store.retailProfitPercentage }}%</p>
        </div>
      </div>
      
      <!-- Wholesale Price -->
      <div class="bg-green-50 p-4 rounded-lg border border-green-100">
        <label class="block text-sm font-medium text-green-700 mb-2">
          <i class="fas fa-box-open mr-2 text-green-600"></i> ഹോൾസെയിൽ വില
        </label>
        <div class="flex items-center">
          <span class="mr-2 text-green-500">₹</span>
          <input 
            type="number" 
            class="w-full px-3 py-2 border border-green-300 rounded-md input-highlight bg-white" 
            v-model="store.prices.wholesale"
          >
          <span class="ml-2 text-green-500">/യൂണിറ്റ്</span>
        </div>
        <div class="flex justify-between mt-2">
          <p class="text-xs text-green-600">ലാഭം: ₹{{ store.wholesaleProfit.toFixed(2) }}</p>
          <p class="text-xs text-green-600">ലാഭ %: {{ store.wholesaleProfitPercentage }}%</p>
        </div>
      </div>
    </div>

    <!-- Price Policy -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">വില നയം</label>
      <select 
        class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md input-highlight"
        v-model="store.pricePolicy"
      >
        <option value="fixed">നിശ്ചിത വില</option>
        <option value="percentage">ശതമാനം അടിസ്ഥാനമാക്കിയുള്ള വില</option>
        <option value="tiered">ടയർ ഡ് വില</option>
      </select>
    </div>

    <!-- Warning -->
    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-exclamation-circle text-yellow-500"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            <span class="font-medium">ശ്രദ്ധിക്കുക!</span> അടിസ്ഥാന വില മാറ്റം എല്ലാ ഷോപ്പുകളിലെയും വിലകളെ ബാധിക്കും, ഷോപ്പ് നിർദ്ദിഷ്ട വില സജ്ജീകരണങ്ങൾ ഇല്ലെങ്കിൽ.
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import { useProductPricingStore } from '@/stores/ProductAndPricingStore';
import { debounce } from 'lodash';

const store = useProductPricingStore();
const { currentUser } = storeToRefs(store);
const saveStatus = ref(null);
const saveMessage = ref('');

const debouncedSave = debounce(async () => {
  try {
    if (!currentUser.value?.shop_id) {
      saveStatus.value = 'error';
      saveMessage.value = 'ദയവായി ആദ്യം ലോഗിൻ ചെയ്യുക!';
      return;
    }

    saveStatus.value = 'saving';
    await store.updateBasePrices(store.prices);
    saveStatus.value = 'success';
    saveMessage.value = 'വില വിജയകരമായി സംരക്ഷിച്ചു!';
  } catch (error) {
    saveStatus.value = 'error';
    saveMessage.value = error.message || 'വിൽ മാറ്റം സേവ് ചെയ്യുന്നതിൽ പിശക്!';
  } finally {
    setTimeout(() => {
      saveStatus.value = null;
      saveMessage.value = '';
    }, 3000);
  }
}, 1000);

// Add auth check in watcher
watch(
  () => ({ ...store.prices }),
  (newVal, oldVal) => {
    if (!currentUser.value?.shop_id) return;
    
    if (newVal.purchase !== oldVal.purchase || 
        newVal.retail !== oldVal.retail || 
        newVal.wholesale !== oldVal.wholesale) {
      debouncedSave();
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  debouncedSave.cancel();
});
</script>
