<!-- src/components/NavigationBar.vue -->
<template>
    <nav class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and links -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <i class="fas fa-store text-indigo-600 text-2xl mr-2"></i>
              <span class="text-xl font-bold text-gray-900">മലയാളം കട</span>
            </router-link>
          </div>
          
          <!-- Navigation items -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link 
              v-for="nav in navigation"
              :key="nav.path"
              :to="nav.path"
              class="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
              {{ nav.label }}
            </router-link>
            
            <!-- Cart dropdown -->
            <div class="relative">
              <button @click="toggleCart" class="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium flex items-center">
                <i class="fas fa-shopping-cart mr-1"></i>
                കാർട്ട്
                <span v-if="cartCount > 0" class="ml-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{{ cartCount }}</span>
              </button>
              <CartDropdown v-if="showCart" />
            </div>
            
            <!-- Profile -->
            <router-link to="/profile" class="flex items-center">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" class="h-8 w-8 rounded-full" alt="Profile">
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useCartStore } from '@/stores/cart'
  import CartDropdown from '@/components/CartDropdown.vue'
  
  const cartStore = useCartStore()
  const showCart = ref(false)
  const cartCount = computed(() => cartStore.cartCount)
  
  const navigation = [
    { path: '/products', label: 'ഉൽപ്പന്നങ്ങൾ' },
    { path: '/orders', label: 'ഓർഡറുകൾ' }
  ]
  
  const toggleCart = () => {
    showCart.value = !showCart.value
  }
  </script>