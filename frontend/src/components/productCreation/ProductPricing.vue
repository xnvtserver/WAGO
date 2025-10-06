<template>
  <div>
    <h3 class="text-lg font-bold text-gray-800 mb-4">വിലനിർണ്ണയ സജ്ജീകരണങ്ങൾ</h3>
    <div class="mb-8">
      <label class="block text-sm font-medium text-gray-700 mb-3">വില തരം: നിശ്ചിത വില</label>
      <p class="text-xs text-gray-500">എല്ലാ ഷോപ്പുകൾക്കും ഒരേ നിശ്ചിത വില സജ്ജീകരിക്കും.</p>
    </div>

    <div>
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gray-50 p-4 rounded-lg">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fas fa-shopping-cart mr-2 text-blue-600"></i> വാങ്ങിയ വില*
          </label>
          <div class="flex items-center">
            <span class="mr-2 text-gray-500">₹</span>
            <input type="number" v-model.number="form.purchase_price"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md input-highlight" placeholder="0.00"
                   min="0" step="0.01" required>
            <span class="ml-2 text-gray-500">/യൂണിറ്റ്</span>
          </div>
          <p class="text-xs text-gray-500 mt-2">സപ്ലയർ വില (ചെലവ് വില)</p>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <label class="block text-sm font-medium text-blue-700 mb-2">
            <i class="fas fa-tag mr-2 text-blue-600"></i> റീട്ടെയിൽ വില*
          </label>
          <div class="flex items-center">
            <span class="mr-2 text-blue-500">₹</span>
            <input type="number" step="0.01" v-model.number="form.retail_price"
                   class="w-full px-3 py-2 border border-blue-300 rounded-md input-highlight bg-white"
                   placeholder="0.00" min="0" required>
            <span class="ml-2 text-blue-500">/യൂണിറ്റ്</span>
          </div>
          <div class="flex justify-between mt-2">
            <p class="text-xs text-blue-600">ലാഭം: ₹{{ retailProfit.toFixed(2) }}</p>
            <p class="text-xs text-blue-600">ലാഭ %: {{ retailProfitPercent }}%</p>
          </div>
        </div>

        <div class="bg-green-50 p-4 rounded-lg border border-green-100">
          <label class="block text-sm font-medium text-green-700 mb-2">
            <i class="fas fa-box-open mr-2 text-green-600"></i> ഹോൾസെയിൽ വില*
          </label>
          <div class="flex items-center">
            <span class="mr-2 text-green-500">₹</span>
            <input type="number" v-model.number="form.wholesale_price"
                   class="w-full px-3 py-2 border border-green-300 rounded-md input-highlight bg-white"
                   placeholder="0.00" min="0" step="0.01" required>
            <span class="ml-2 text-green-500">/യൂണിറ്റ്</span>
          </div>
          <div class="flex justify-between mt-2">
            <p class="text-xs text-green-600">ലാഭം: ₹{{ wholesaleProfit.toFixed(2) }}</p>
            <p class="text-xs text-green-600">ലാഭ %: {{ wholesaleProfitPercent }}%</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-1">പ്രാരംഭ സ്റ്റോക്ക്*</label>
      <input type="number" v-model.number="form.stock"
             class="w-full px-3 py-2 border border-gray-300 rounded-md input-highlight" placeholder="0" min="0"
             step="1" required>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  form: Object
});

// Computed properties
const retailProfit = computed(() => {
  const retail = parseFloat(props.form.retail_price);
  const purchase = parseFloat(props.form.purchase_price);
  return (!isNaN(retail) && !isNaN(purchase) && retail >= purchase) ? retail - purchase : 0;
});

const retailProfitPercent = computed(() => {
  const purchase = parseFloat(props.form.purchase_price);
  return (!isNaN(purchase) && purchase > 0 && retailProfit.value > 0)
    ? ((retailProfit.value / purchase) * 100).toFixed(2)
    : '0.00';
});

const wholesaleProfit = computed(() => {
  const wholesale = parseFloat(props.form.wholesale_price);
  const purchase = parseFloat(props.form.purchase_price);
  return (!isNaN(wholesale) && !isNaN(purchase) && wholesale >= purchase) ? wholesale - purchase : 0;
});

const wholesaleProfitPercent = computed(() => {
  const purchase = parseFloat(props.form.purchase_price);
  return (!isNaN(purchase) && purchase > 0 && wholesaleProfit.value > 0)
    ? ((wholesaleProfit.value / purchase) * 100).toFixed(2)
    : '0.00';
});
</script>