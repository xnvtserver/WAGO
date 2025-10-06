<!-- src/components/billing/ProductItem.vue -->
<template>
    <div class="product-card bg-white border rounded-lg p-4">
      <div class="flex items-start">
        <img :src="product.image" :alt="product.name" class="w-16 h-16 object-cover rounded">
        <div class="ml-3 flex-1">
          <h3 class="font-bold text-gray-800">{{ product.name }}</h3>
          <p class="text-sm text-gray-600">{{ product.description }}</p>
          <p class="text-green-700 font-bold mt-1">₹{{ product.price }} / കിലോ</p>
        </div>
      </div>
      
      <div class="mt-3 flex items-center justify-between">
        <div class="flex items-center border rounded">
          <!-- Decrement Controls -->
          <div class="relative">
            <button 
              @mousedown.prevent="startLongPress('decrement')"
              @mouseup="clearLongPress"
              @touchstart.prevent="startLongPress('decrement')"
              @touchend="clearLongPress"
              class="quantity-btn px-3 py-1 bg-gray-100"
            >
              -
            </button>
            <div v-show="showDecrementMenu" class="absolute bg-white border rounded mt-1 z-10 shadow-lg">
              <button 
                v-for="option in fractionOptions" 
                :key="option.label"
                @click="updateQuantity(option.value)"
                class="block w-full px-3 py-1 hover:bg-gray-100 text-sm"
              >
                {{ option.decrementLabel }}
              </button>
            </div>
          </div>
  
          <!-- Quantity Display -->
          <div class="flex items-center">
            <span class="px-3">{{ product.quantity.toFixed(2) }}</span>
            <button 
              @click="$emit('clear-quantity', product.id)"
              class="clear-btn px-2 text-red-600 hover:text-red-800"
              title="Clear quantity"
            >
              ×
            </button>
          </div>
  
          <!-- Increment Controls -->
          <div class="relative">
            <button 
              @mousedown.prevent="startLongPress('increment')"
              @mouseup="clearLongPress"
              @touchstart.prevent="startLongPress('increment')"
              @touchend="clearLongPress"
              class="quantity-btn px-3 py-1 bg-gray-100"
            >
              +
            </button>
            <div v-show="showIncrementMenu" class="absolute bg-white border rounded mt-1 z-10 shadow-lg">
              <button 
                v-for="option in fractionOptions" 
                :key="option.label"
                @click="updateQuantity(option.value)"
                class="block w-full px-3 py-1 hover:bg-gray-100 text-sm"
              >
                {{ option.incrementLabel }}
              </button>
            </div>
          </div>
        </div>
        
        <span class="font-bold">₹{{ (product.quantity * product.price).toFixed(2) }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
    product: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['update-quantity', 'clear-quantity'])
  
  const fractionOptions = [
    { value: 2, label: '2', decrementLabel: '-2', incrementLabel: '+2' },
    { value: 0.75, label: '¾', decrementLabel: '-¾ മുക്കാൽ', incrementLabel: '+¾ മുക്കാൽ' },
    { value: 0.5, label: '½', decrementLabel: '-½ അര', incrementLabel: '+½ അര' },
    { value: 0.25, label: '¼', decrementLabel: '-¼ കാൽ', incrementLabel: '+¼ കാൽ' }
  ]
  
  const showIncrementMenu = ref(false)
  const showDecrementMenu = ref(false)
  let longPressTimer = null
  
  const startLongPress = (type) => {
    longPressTimer = setTimeout(() => {
      type === 'increment' 
        ? showIncrementMenu.value = true
        : showDecrementMenu.value = true
    }, 500)
  }
  
  const clearLongPress = () => {
    clearTimeout(longPressTimer)
    showIncrementMenu.value = false
    showDecrementMenu.value = false
  }
  
  const updateQuantity = (change) => {
  const newQuantity = Math.max(0, parseFloat((props.product.quantity + change).toFixed(2)),
  emit('update-quantity', props.product.id, newQuantity),
  showIncrementMenu.value = false,
  showDecrementMenu.value = false)
}
  </script>
  
  <style scoped>
  .quantity-btn {
    transition: all 0.2s;
    min-width: 2.5rem;
  }
  
  .clear-btn {
    border-left: 1px solid #e5e7eb;
    border-right: 1px solid #e5e7eb;
    transition: color 0.2s;
  }
  </style>