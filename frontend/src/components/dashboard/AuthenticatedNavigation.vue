<template>
  <nav class="bg-indigo-600 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/dashboard" class="flex-shrink-0 flex items-center">
            <i class="fas fa-store text-white text-2xl mr-2"></i>
            <span class="text-xl font-bold text-white">കട ഡാഷ്‌ബോർഡ്</span>
          </router-link>
        </div>
        <div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
          <router-link to="/dashboard" class="text-gray-300 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            ഡാഷ്‌ബോർഡ്
          </router-link>
          <button @click="handleLogout" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150">
            ലോഗൗട്ട്
          </button>
        </div>
        <div class="-mr-2 flex items-center md:hidden">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" type="button" class="bg-indigo-600 inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-expanded="false">
            <span class="sr-only">Open main menu</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isMobileMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link to="/dashboard" class="bg-indigo-700 text-white block px-3 py-2 rounded-md text-base font-medium" aria-current="page">
          ഡാഷ്‌ബോർഡ്
        </router-link>
        <button @click="handleLogout" class="bg-red-600 hover:bg-red-700 text-white block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150">
          ലോഗൗട്ട്
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMobileMenuOpen = ref(false)

const handleLogout = () => {
  localStorage.removeItem('authToken')
  router.push('/login')
}
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>