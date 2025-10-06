<template>
  <div class="mb-4 relative">
    <input type="text" v-model="query" @keyup.enter="$emit('search-enter')" placeholder="ഉൽപ്പന്നം തിരയുക..."
      class="w-full p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
    <ul v-if="filteredProducts.length"
      class="absolute z-10 w-full bg-white border shadow-lg mt-1 max-h-60 overflow-auto">
      <li v-for="product in filteredProducts" :key="product.id" @click="$emit('select', product)"
        class="p-2 hover:bg-gray-100 cursor-pointer">
        {{ product.name }} ({{ product.price }})
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  query: string;
  filteredProducts: any[];
}>();

defineEmits(['search-enter', 'select']);
</script>
<!-- <template>
  <div class="mb-4 relative" @keydown.esc="closeDropdown">
    <input 
      type="text" 
      ref="searchInput"
      v-model="searchQuery"
      @input="handleInput"
      @keydown.down="moveSelection(1)"
      @keydown.up="moveSelection(-1)"
      @keydown.enter="handleEnter"
      placeholder="ഉൽപ്പന്നം തിരയുക അല്ലെങ്കിൽ ബാർക്കോഡ് നൽകുക"
      class="w-full p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      :aria-activedescendant="selectedIndex !== -1 ? `product-${selectedIndex}` : null"
    />
    
    <ul 
      v-if="showResults"
      id="search-results"
      role="listbox"
      class="absolute z-10 w-full bg-white border shadow-lg mt-1 max-h-60 overflow-auto"
    >
      <li 
        v-for="(product, index) in searchedProducts" 
        :key="product.id"
        :id="`product-${index}`"
        @click="selectProduct(product)"
        @mouseover="selectedIndex = index"
        :class="['p-2', 'cursor-pointer', { 'bg-blue-50': index === selectedIndex }]"
        role="option"
      >
        <div class="flex justify-between items-center">
          <span class="font-medium">{{ product.name }}</span>
          <span class="text-sm text-gray-600">₹{{ product.price }}</span>
        </div>
        <div v-if="product.barcode" class="text-xs text-gray-400 mt-1">
          ബാർക്കോഡ്: {{ product.barcode }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { debounce } from 'lodash-es';

const searchQuery = ref('');
const selectedIndex = ref(-1);
const searchInput = ref(null);

const props = defineProps({
  searchedProducts: Array,
  searchDelay: { type: Number, default: 200 },
});

const emit = defineEmits([
  'update:modelValue',
  'product-selected',
  'search',
  'barcode-search'
]);

const showResults = ref(false);

// Enhanced search handling
const handleInput = debounce(async (event) => {
  const query = event.target.value.trim();
  showResults.value = query.length > 0;
  
  if (isValidBarcode(query)) {
    emit('barcode-search', query);
  } else {
    emit('search', query);
  }
  
  await nextTick();
  selectedIndex.value = -1;
}, props.searchDelay);

// Barcode detection logic
const isValidBarcode = (input) => {
  const barcodePattern = /^\d{12,14}$/;
  return barcodePattern.test(input);
};

// Keyboard navigation
const moveSelection = (direction) => {
  if (!showResults.value) return;

  const maxIndex = props.searchedProducts.length - 1;
  selectedIndex.value = Math.max(-1, Math.min(maxIndex, selectedIndex.value + direction));
  
  if (selectedIndex.value >= 0) {
    scrollToSelection();
  }
};

// Auto-select single result
watch(() => props.searchedProducts, (newVal) => {
  if (newVal.length === 1) {
    selectedIndex.value = 0;
  }
});

const handleEnter = () => {
  if (selectedIndex.value >= 0 && props.searchedProducts[selectedIndex.value]) {
    selectProduct(props.searchedProducts[selectedIndex.value]);
  } else if (props.searchedProducts.length === 1) {
    selectProduct(props.searchedProducts[0]);
  } else if (isValidBarcode(searchQuery.value)) {
    emit('barcode-search', searchQuery.value.trim());
  }
};

const selectProduct = (product) => {
  emit('product-selected', product);
  resetSearch();
  focusInput();
};

const closeDropdown = () => {
  showResults.value = false;
  selectedIndex.value = -1;
};

const resetSearch = () => {
  searchQuery.value = '';
  closeDropdown();
};

const focusInput = () => {
  searchInput.value?.focus();
};

const scrollToSelection = () => {
  const element = document.getElementById(`product-${selectedIndex.value}`);
  element?.scrollIntoView({ block: 'nearest' });
};

// Expose focus method for parent components
defineExpose({ focusInput });
</script> -->