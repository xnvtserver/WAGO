<!-- /src/components/settings/MobileSidebar.vue -->
<template>
    <div v-if="isOpen" class="md:hidden fixed inset-0 z-40">
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="$emit('close')"></div>
      
      <div class="relative flex flex-col flex-1 w-64 max-w-xs bg-white transform transition ease-in-out duration-300">
        <div class="flex items-center justify-center h-16 px-4 bg-blue-600">
          <span class="text-white font-bold text-xl">StorePro</span>
        </div>
        
        <div class="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <div class="space-y-1">
            <a v-for="link in links" 
               :key="link.id"
               @click="navigate(link.id)"
               class="flex items-center px-2 py-3 text-sm font-medium rounded-md sidebar-link"
               :class="{ 'active': activeTab === link.id }">
              <i :class="link.icon" class="mr-3"></i>
              {{ link.label }}
            </a>
          </div>
        </div>
        
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center">
            <img class="w-10 h-10 rounded-full" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin">
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700">Admin User</p>
              <p class="text-xs font-medium text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isOpen: Boolean,
      activeTab: String
    },
    data() {
      return {
        links: [
          { id: 'store-info', label: 'Store Information', icon: 'fas fa-store' },
          { id: 'user-management', label: 'User Management', icon: 'fas fa-users-cog' },
          { id: 'tax-settings', label: 'Tax Settings', icon: 'fas fa-receipt' }
        ]
      }
    },
    methods: {
      navigate(tabId) {
        this.$emit('navigate', tabId)
        this.$emit('close')
      }
    }
  }
  </script>
  
  <style scoped>
  .sidebar-link {
    @apply text-gray-600 hover:bg-gray-50 hover:text-gray-900;
  }
  
  .sidebar-link.active {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }
  
  /* Transition effects */
  .mobile-sidebar-enter-active, .mobile-sidebar-leave-active {
    transition: transform 0.3s ease;
  }
  .mobile-sidebar-enter, .mobile-sidebar-leave-to {
    transform: translateX(-100%);
  }
  </style>