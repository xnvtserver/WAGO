<template>
  <div class="flex items-center space-x-1.5 sm:space-x-2 w-full sm:w-auto justify-end">
    <button @click="$emit('decrement')"
      class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="quantity <= 0 || product.stock === 0">
      <i class="fas fa-minus text-sm"></i>
    </button>
    
    <input type="number" :value="quantity" @input="$emit('update', $event.target.value)"
      min="0" :max="product.stock" step="0.1"
      class="w-16 sm:w-20 h-8 text-center border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      :disabled="product.stock === 0" />
    
    <button @click="$emit('increment')"
      class="w-8 h-8 bg-green-200 hover:bg-green-300 text-green-800 rounded-md flex items-center justify-center transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="quantity >= product.stock || product.stock === 0">
      <i class="fas fa-plus text-sm"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  product: any;
  quantity: number;
}>();

defineEmits(['update', 'increment', 'decrement']);
</script>
<!-- <template>
  <div class="flex items-center space-x-1.5 sm:space-x-2 w-full sm:w-auto justify-end">
    <button @click="$emit('decrement')"
      class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="quantity <= 0 || product.stock === 0">
      <i class="fas fa-minus text-sm"></i>
    </button>

    <input type="number" 
      :value="quantity.toFixed(1)"
      @input="handleInput($event.target.value)"
      :min="0"
      :max="product.stock"
      :step="inputStep"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      class="w-16 sm:w-20 h-8 text-center border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      :disabled="product.stock === 0"
      aria-label="Quantity"
    />

    <button @click="$emit('increment')"
      class="w-8 h-8 bg-green-200 hover:bg-green-300 text-green-800 rounded-md flex items-center justify-center transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="quantity >= product.stock || product.stock === 0">
      <i class="fas fa-plus text-sm"></i>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const handleInput = (value) => {
  const parsed = parseFloat(value);
  if (!isNaN(parsed)) {
    emit('update', Math.max(0, parsed));
  }
};

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['increment', 'decrement', 'update']);

const inputStep = computed(() => {
  return props.product.name.toLowerCase().includes('തേങ്ങ') ? 1 : 0.1;
});
</script> -->