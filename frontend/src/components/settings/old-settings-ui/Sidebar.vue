<!-- components/settings/Sidebar.vue -->
<template>
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="flex flex-col w-64 bg-white border-r border-gray-200">
        <!-- Sidebar content from original HTML -->
        <div class="flex items-center justify-center h-16 px-4 bg-blue-600">
                    <span class="text-white font-bold text-xl">StorePro</span>
                </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['activeTab'],
    methods: {
      changeTab(tab) {
        this.$emit('change-tab', tab)
      }
    }
  }
  </script>