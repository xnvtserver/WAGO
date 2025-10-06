<!-- src/components/CartDropdown.vue -->
<template>
    <div class="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-20">
      <div v-if="items.length > 0" class="max-h-96 overflow-y-auto">
        <div v-for="item in items" :key="item.id" class="px-4 py-2 border-b border-gray-100 flex items-center">
          <img :src="item.image" class="h-12 w-12 object-cover rounded" alt="">
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</p>
            <p class="text-xs text-gray-500">{{ item.quantity }} x ₹{{ item.price }}</p>
          </div>
          <button @click="removeFromCart(item.id)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="px-4 py-3 bg-gray-50 flex justify-between items-center">
          <span class="text-sm font-medium">ആകെ: ₹{{ total }}</span>
          <router-link to="/checkout" class="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">ചെക്ക്ഔട്ട്</router-link>
        </div>
      </div>
      <div v-else class="px-4 py-3 text-center text-gray-500">
        കാർട്ട് ശൂന്യമാണ്
      </div>
    </div>
  </template>
  
  <script setup>
  import { useCartStore } from '@/stores/cart'
  
  const cartStore = useCartStore()
  
  const items = computed(() => cartStore.items)
  const total = computed(() => cartStore.cartTotal)
  
  const removeFromCart = (productId) => {
    cartStore.removeFromCart(productId)
  }
  </script>