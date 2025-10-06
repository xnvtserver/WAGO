<!-- src/views/CheckoutView.vue -->
<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Checkout form -->
        <div class="md:col-span-2">
          <h2 class="text-2xl font-bold mb-6">ഓർഡർ വിശദാംശങ്ങൾ</h2>
          <form @submit.prevent="handleCheckout" class="space-y-4">
            <!-- Form fields -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">പേര്</label>
                <input type="text" required class="w-full px-3 py-2 border rounded-md">
              </div>
              <!-- Add more form fields -->
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-md">
              പേയ്മെന്റ് ചെയ്യുക
            </button>
          </form>
        </div>
        
        <!-- Order summary -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-bold mb-4">ഓർഡർ സംഗ്രഹം</h3>
          <div v-for="item in cartItems" :key="item.id" class="flex items-center mb-4">
            <img :src="item.image" class="h-16 w-16 object-cover rounded" alt="">
            <div class="ml-3">
              <p class="font-medium">{{ item.name }}</p>
              <p class="text-sm text-gray-500">{{ item.quantity }} x ₹{{ item.price }}</p>
            </div>
          </div>
          <div class="border-t pt-4">
            <div class="flex justify-between font-bold">
              <span>ആകെ:</span>
              <span>₹{{ cartTotal }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useCartStore } from '@/stores/cart'
  import { useRouter } from 'vue-router'
  
  const cartStore = useCartStore()
  const router = useRouter()
  
  const cartItems = computed(() => cartStore.items)
  const cartTotal = computed(() => cartStore.cartTotal)
  
  const handleCheckout = async () => {
    // Handle payment logic
    cartStore.clearCart()
    router.push('/orders')
  }
  </script>