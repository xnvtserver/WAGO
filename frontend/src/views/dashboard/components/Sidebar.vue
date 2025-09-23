<template>
  <aside class="w-64 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
    <div class="px-6 py-4 text-2xl font-bold">🚗 Car Wash</div>
    <nav class="flex-1">
      <ul class="space-y-2 px-4">
        <li>
          <router-link to="/dashboard" class="block px-3 py-2 rounded-lg hover:bg-white/10">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/bookings" class="block px-3 py-2 rounded-lg hover:bg-white/10">Bookings</router-link>
        </li>
        <li>
          <router-link to="/services" class="block px-3 py-2 rounded-lg hover:bg-white/10">Service Packages</router-link>
        </li>
        <li>
          <router-link to="/staff" class="block px-3 py-2 rounded-lg hover:bg-white/10">Staff</router-link>
        </li>
        <li>
          <router-link to="/customers" class="block px-3 py-2 rounded-lg hover:bg-white/10">Customers</router-link>
        </li>
        <li>
          <router-link to="/analytics" class="block px-3 py-2 rounded-lg hover:bg-white/10">Analytics</router-link>
        </li>
      </ul>
    </nav>
    <div class="px-6 py-4 border-t border-white/10">
      <button @click="handleLogout" class="w-full py-2 rounded-md bg-gradient-to-r from-emerald-400 to-sapphire-500">Logout</button>
    </div>
  </aside>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    await authStore.logout()
    alert('You have been logged out.')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
