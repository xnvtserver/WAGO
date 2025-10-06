<template>
  <div class="bg-white rounded-xl shadow-lg bill-card p-3 sm:p-5">
    <div class="flex items-center justify-between mb-4 border-b border-green-200 pb-3">
      <h2 class="text-xl sm:text-2xl font-bold text-green-700">ഉൽപ്പന്നങ്ങൾ</h2>
      <QuickAddButton @click="$emit('open-scanner')" />
    </div>

    <ProductBarcodeInput v-model="barcode" :error="barcodeError" :disabled="loading" @scan="$emit('scan-barcode')" />

    <ProductSearch :query="searchQuery" :filtered-products="filteredProducts" 
      @search-enter="$emit('search-enter')" @select="$emit('select-product', $event)" />

    <div v-if="loading" class="text-center py-10">
      <i class="fas fa-spinner fa-spin text-3xl text-green-500"></i>
      <p class="mt-3 text-gray-600">ഉൽപ്പന്നങ്ങൾ ലോഡ് ചെയ്യുന്നു...</p>
    </div>
    
    <div v-else-if="products.length === 0" class="text-center py-10 text-gray-500">
      <i class="fas fa-store-slash text-3xl mb-2"></i>
      <p>ക്ഷമിക്കണം, ഇപ്പോൾ ഉൽപ്പന്നങ്ങൾ ലഭ്യമല്ല.</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <div v-for="product in products" :key="product.id"
        class="border border-gray-200 rounded-lg p-3 transition-all duration-300 hover:shadow-md"
        :class="{ 'opacity-60 bg-gray-50': product.stock === 0 }">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div class="mb-2 sm:mb-0">
            <h3 class="font-bold text-gray-800 text-md sm:text-lg">{{ product.name }}</h3>
            <p class="text-sm text-gray-600">₹{{ product.price.toFixed(2) }} / കിലോ</p>
            <StockStatus :stock="product.stock" />
          </div>
          <QuantityControls :product="product" :quantity="quantities[product.id]"
            @update="(val) => $emit('update-quantity', product.id, val)"
            @increment="$emit('increment-quantity', product.id)"
            @decrement="$emit('decrement-quantity', product.id)" />
        </div>
        <div v-if="product.stock > 0" class="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
          <span class="text-sm text-gray-500">ആകെ: </span>
          <span class="font-medium text-gray-800">₹{{ (quantities[product.id] * product.price).toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  products: any[];
  quantities: Record<string, number>;
  loading: boolean;
  barcode: string;
  barcodeError: string;
  searchQuery: string;
  filteredProducts: any[];
}>();

defineEmits([
  'open-scanner',
  'scan-barcode',
  'search-enter',
  'select-product',
  'update-quantity',
  'increment-quantity',
  'decrement-quantity'
]);
</script>
<!-- <template>
  <div>
    <div v-if="loading" class="text-center py-10">
      <i class="fas fa-spinner fa-spin text-3xl text-green-500"></i>
      <p class="mt-3 text-gray-600">ഉൽപ്പന്നങ്ങൾ ലോഡ് ചെയ്യുന്നു...</p>
    </div>

    <div v-else-if="!filteredProducts.length" class="text-center py-10 text-gray-500">
      <i class="fas fa-store-slash text-3xl mb-2"></i>
      <p>ക്ഷമിക്കണം, ഇപ്പോൾ ഉൽപ്പന്നങ്ങൾ ലഭ്യമല്ല.</p>
    </div>

    <div v-else>
      <div class="mb-4 flex flex-wrap gap-2 items-center">
        <input 
          type="text"
          v-model="quickSearch"
          placeholder="ക്വിക്ക് തിരയൽ..."
          class="p-2 border rounded-lg text-sm flex-grow max-w-[200px]"
          @keyup.esc="quickSearch = ''"
        >
        <button 
          @click="$emit('quick-stock-check')"
          class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
        >
          <i class="fas fa-boxes mr-2"></i>സ്റ്റോക്ക് സംഗ്രഹം
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="border border-gray-200 rounded-lg p-3 transition-all duration-300 hover:shadow-md"
          :class="{ 
            'opacity-60 bg-gray-50': product.stock === 0,
            'border-green-200': quantities[product.id] > 0,
            'border-yellow-200': isLowStock(product)
          }"
        >
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div class="mb-2 sm:mb-0">
              <h3 class="font-bold text-gray-800 text-md sm:text-lg">{{ product.name }}</h3>
              <p class="text-sm text-gray-600">₹{{ product.price.toFixed(2) }} / കിലോ</p>
              <StockStatus :product="product" />
            </div>

            <div class="flex items-center gap-2">
              <QuickAddButton 
                :product="product"
                @add="$emit('increment', product.id)"
                class="hidden sm:block"
              />
              <QuantityControls
                :product="product"
                :quantity="quantities[product.id] || 0"
                @increment="$emit('increment', product.id)"
                @decrement="$emit('decrement', product.id)"
                @update="$emit('quantity-update', { id: product.id, value: $event })"
                @focus="$emit('focus', product.id)"
                @blur="$emit('blur')"
              />
            </div>
          </div>

          <div v-if="product.stock > 0 && quantities[product.id]" class="mt-2 pt-2 border-t border-gray-100">
            <span class="block text-xs text-gray-500">
              {{ quantities[product.id].toFixed(2) }} കിലോ × ₹{{ product.price.toFixed(2) }}
            </span>
            <span class="block text-sm font-medium text-gray-800">
              ആകെ: ₹{{ (quantities[product.id] * product.price).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import StockStatus from './StockStatus.vue';
import QuantityControls from './QuantityControls.vue';
import QuickAddButton from './QuickAddButton.vue';

const props = defineProps({
  products: Array,
  quantities: object,
  loading: Boolean,
  // lowStockThreshold: {
  //   type: Number,
  //   default: 5
  // }
});

const emit = defineEmits([
  'increment',
  'decrement',
  'quantity-update',
  'quick-stock-check',
  'focus',
  'blur'
]);

const quickSearch = ref('');

const filteredProducts = computed(() => {
  return props.products.filter(product => {
    const searchMatch = product.name.toLowerCase().includes(quickSearch.value.toLowerCase()) ||
      (product.barcode?.includes(quickSearch.value));
    
    const stockMatch = product.stock > 0;
    const quantityMatch = props.quantities[product.id] > 0;
    
    return searchMatch && stockMatch && quantityMatch;
  });
});

const isLowStock = (product) => {
  return product.stock > 0 && product.stock <= props.lowStockThreshold;
};
</script> -->