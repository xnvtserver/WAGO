<!--front-end/src/components/product-pricing/QuickEditSidebar.vue-->
<template>
  <div
    id="quickEditSidebar"
    class="quick-edit-sidebar fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-40 p-6 transition-transform duration-300 ease-in-out"
    :class="store.quickEditSidebarOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="pt-4 border-t border-gray-200">
      <button
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        @click="saveQuickEditChanges"
      >
        <i class="fas fa-save mr-2"></i> മാറ്റങ്ങൾ സംരക്ഷിക്കുക
      </button>
    </div>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">റീട്ടെയിൽ വില</label>
        <div class="flex items-center">
          <span class="mr-2 text-gray-500">₹</span>
          <input
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded input-highlight"
            v-model="store.prices.retail"
          >
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">ഹോൾസെയിൽ വില</label>
        <div class="flex items-center">
          <span class="mr-2 text-gray-500">₹</span>
          <input
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded input-highlight"
            v-model="store.prices.wholesale"
          >
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">വാങ്ങിയ വില</label>
        <div class="flex items-center">
          <span class="mr-2 text-gray-500">₹</span>
          <input
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded input-highlight"
            v-model="store.prices.purchase"
          >
        </div>
      </div>

      <div class="pt-4 border-t border-gray-200">
        <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
          <i class="fas fa-save mr-2"></i> മാറ്റങ്ങൾ സംരക്ഷിക്കുക
        </button>
      </div>
    </div>
</template>

<script setup>
import { useProductPricingStore } from '@/stores/ProductAndPricingStore';
const store = useProductPricingStore();

const saveQuickEditChanges = async () => {
  try {
    // Determine if you're saving to base price or a specific shop price
    // For example, assuming you want to update the base price from quick edit:
    await store.updateBasePrice(store.currentProduct.id, store.prices);
    store.toggleQuickEditSidebar(); // Close the sidebar after saving
    console.log('Quick edit changes saved!');
  } catch (error) {
    console.error('Error saving quick edit changes:', error);
  }
};
</script>