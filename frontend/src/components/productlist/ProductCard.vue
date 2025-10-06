<!-- src/components/ProductCard.vue -->
<template>
    <div class="product-card bg-white rounded-lg overflow-hidden">
      <div class="relative">
        <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover">
        <div v-if="product.discount" class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {{ product.discount }}% OFF
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ product.name }}</h3>
        <p class="text-sm text-gray-600 mb-2">{{ product.description }}</p>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-lg font-bold text-gray-900">₹{{ product.price }}</span>
            <span v-if="product.originalPrice" class="ml-2 text-sm text-gray-500 line-through">₹{{ product.originalPrice }}</span>
          </div>
          <button 
            @click="addToCart"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm flex items-center">
            <i class="fas fa-cart-plus mr-1"></i>
            കാർട്ടിൽ ചേർക്കുക
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useCartStore } from '@/stores/cart'
  
  const props = defineProps({
    product: {
      type: Object,
      required: true
    }
  })
  
  const cartStore = useCartStore()
  
  const addToCart = () => {
    cartStore.addToCart(props.product)
  }
  </script>