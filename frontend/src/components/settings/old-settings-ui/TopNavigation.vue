<!-- components/settings/TopNavigation.vue -->
<template>
    <div class="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
      <div class="flex items-center">
        <button class="md:hidden text-gray-500 focus:outline-none" @click="$emit('toggle-sidebar')">
          <i class="fas fa-bars text-xl"></i>
        </button>
        <h1 class="ml-4 text-xl font-semibold text-gray-800">{{ pageTitle }}</h1>
      </div>
      <div class="flex items-center">
        <button class="p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none">
          <i class="fas fa-bell text-xl"></i>
        </button>
        <div class="ml-4">
          <div class="flex items-center">
            <img class="w-8 h-8 rounded-full" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin">
            <span class="ml-2 text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['activeTab'],
    computed: {
      pageTitle() {
        const titles = {
          'store-info': 'Store Information',
          'user-management': 'User Management',
          'tax-settings': 'Tax Settings'
        }
        return titles[this.activeTab]
      }
    }
  }
  </script>