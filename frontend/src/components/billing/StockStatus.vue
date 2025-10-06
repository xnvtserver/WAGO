<template>
  <p class="text-xs mt-1" :class="stockClass">
    <span v-if="stock > 0">സ്റ്റോക്ക്: {{ stock }} കിലോ</span>
    <span v-else>സ്റ്റോക്ക് ലഭ്യമല്ല</span>
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  stock: number;
}>();

const stockClass = computed(() => ({
  'text-orange-500 font-semibold': props.stock > 0 && props.stock <= 5,
  'text-red-600 font-bold': props.stock === 0,
  'text-gray-500': props.stock > 5
}));
</script>
<!-- <template>
  <p class="text-xs mt-1" :class="statusClass">
    <span v-if="product.stock > 0">സ്റ്റോക്ക്: {{ formattedStock }} കിലോ</span>
    <span v-else>സ്റ്റോക്ക് ലഭ്യമല്ല</span>
  </p>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const formattedStock = computed(() => {
  return props.product.name.toLowerCase().includes('തേങ്ങ') 
    ? props.product.stock.toFixed(0)
    : props.product.stock.toFixed(1);
});

const statusClass = computed(() => {
  if (props.product.stock > 0 && props.product.stock <= 5) {
    return 'text-orange-500 font-semibold';
  }
  if (props.product.stock === 0) {
    return 'text-red-600 font-bold';
  }
  return 'text-gray-500';
});
</script> -->