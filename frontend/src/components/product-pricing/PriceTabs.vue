<!-- front-end/src/components/product-pricing/PriceTabs.vue -->
<template>
  <div class="border-b border-gray-200">
    <div class="flex overflow-x-auto">
      <!-- Base Price -->
      <button 
        @click="$emit('tab-change', 'base-price')"
        :class="['price-tab', 'px-6', 'py-3', 'font-medium', 'text-sm', 'border-b-2', activeTab === 'base-price' ? 'active' : 'border-transparent']"
      >
        <i class="fas fa-tag mr-2"></i> അടിസ്ഥാന വില
      </button>

      <!-- Shop Prices - only if multiple parent shops -->
      <!-- v-if="shopAccess.hasMultipleParentShops" -->
      <button 
        @click="$emit('tab-change', 'shop-prices')"
        :class="['price-tab', 'px-6', 'py-3', 'font-medium', 'text-sm', 'border-b-2', activeTab === 'shop-prices' ? 'active' : 'border-transparent']"
      >
        <i class="fas fa-store mr-2"></i> ഷോപ്പ് വിലകൾ
      </button>

      <!-- Bulk Pricing -->
      <button 
        @click="$emit('tab-change', 'bulk-pricing')"
        :class="['price-tab', 'px-6', 'py-3', 'font-medium', 'text-sm', 'border-b-2', activeTab === 'bulk-pricing' ? 'active' : 'border-transparent']"
      >
        <i class="fas fa-boxes mr-2"></i> ബൾക്ക് വിലനിർണ്ണയം
      </button>

      <!-- Price History -->
      <button 
        @click="$emit('tab-change', 'price-history')"
        :class="['price-tab', 'px-6', 'py-3', 'font-medium', 'text-sm', 'border-b-2', activeTab === 'price-history' ? 'active' : 'border-transparent']"
      >
        <i class="fas fa-history mr-2"></i> വില ചരിത്രം
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeTab: String
});

defineEmits(['tab-change']);
</script>