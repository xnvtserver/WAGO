<!--front-end/src/components/product-pricing/ProductHeader.vue-->
<template>
  <header class="flex justify-between items-center mb-8">
    <div class="flex items-center">
      <!-- <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl mr-3">വി</div> -->
      <h1 class="text-2xl font-bold text-gray-800">ഉൽപ്പന്ന വില സജ്ജീകരണം</h1>
    </div>
    <div class="flex items-center space-x-4">
      <!-- <button class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg">
        <i class="fas fa-save mr-2"></i> സംരക്ഷിക്കുക
      </button> -->
      <router-link to="products/add">
      <button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
        <i class="fas fa-plus mr-2"></i> പുതിയ ഉൽപ്പന്നം
      </button>
      </router-link>
    </div>
  </header>
</template>


<script setup>
import { useProductPricingStore } from '@/stores/ProductAndPricingStore';
const store = useProductPricingStore();

const saveBasePriceChanges = async () => {
  try {
    await store.updateBasePrice(store.currentProduct.id, store.prices); // Assuming store.prices holds the base price data
    // Optionally show a success message
    console.log('Base prices saved successfully!');
  } catch (error) {
    // Optionally show an error message
    console.error('Error saving base prices:', error);
  }
};
</script>