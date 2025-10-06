<template>
  <div
    class="sidebar flex-shrink-0 flex flex-col transition-all duration-300"
    :class="[
      theme.isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800',
      collapsed ? 'w-16' : 'w-64'
    ]"
  >
<!-- Logo -->
<div class="p-4 flex items-center border-b"
     :class="theme.isDark ? 'border-indigo-100' : 'border-gray-300'">
  <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
    <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8 object-contain" />
  </div>
  <span v-if="!collapsed" class="logo-text ml-3 font-bold text-xl">Inventory</span>
</div>


    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto">
      <div class="p-2">
        <!-- Inventory Section -->
        <div class="mb-1 text-xs uppercase font-semibold px-4 py-2"
             :class="theme.isDark ? 'text-indigo-400' : 'text-gray-500'">
          <span v-if="!collapsed">Inventory</span>
        </div>

        <router-link
          v-for="link in inventoryLinks"
          :key="link.path"
          :to="link.path"
          class="nav-item flex items-center px-4 py-3 rounded-lg mx-2 mb-1"
          :class="theme.isDark ? 'text-white hover:bg-indigo-700' : 'text-black hover:bg-indigo-100'"
        >
          <i :class="link.icon"></i>
          <span v-if="!collapsed" class="nav-text ml-3">{{ link.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- Theme Toggle -->
    <!-- <div class="p-4 border-t"
         :class="theme.isDark ? 'border-indigo-100' : 'border-gray-300'">
      <button
        @click="theme.toggleTheme"
        class="w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm"
        :class="theme.isDark ? 'bg-indigo-700 hover:bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'"
      >
        <i :class="theme.isDark ? 'fas fa-sun' : 'fas fa-moon'" class="mr-2"></i>
        <span v-if="!collapsed">{{ theme.isDark ? 'Light Mode' : 'Dark Mode' }}</span>
      </button>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useThemeStore } from '@/stores/theme';

const theme = useThemeStore();
onMounted(theme.initTheme);


// Collapse logic for mobile responsiveness
const collapsed = ref(false);

const handleResize = () => {
  collapsed.value = window.innerWidth < 768;
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

// Inventory-specific links
const inventoryLinks = [
  { path: '/products/add', icon: 'fas fa-plus-square', label: 'ഉൽപ്പന്നങ്ങൾ ചേർക്കുക' },
  { path: '/shop-products/low-stock-products/shop_id', icon: 'fas fa-box-open', label: 'കുറവ് സ്റ്റോക്ക് ഉൽപ്പന്നങ്ങൾ' },
  // { path: '/inventory/:shop_id/high-risk-products', icon: 'fas fa-exclamation-triangle', label: 'അതി റിസ്ക് ഉൽപ്പന്നങ്ങൾ' },
  // { path: '/inventory/shop-products', icon: 'fas fa-store', label: 'അംഗസംവരണത്തിലെ ഉൽപ്പന്നങ്ങൾ' },
  // { path: '/inventory/update-stock-level', icon: 'fas fa-edit', label: 'സ്റ്റോക്ക് ലെവൽ അപ്‌ഡേറ്റ് ചെയ്യുക' },
  // { path: '/inventory/price-history', icon: 'fas fa-history', label: 'വിലാ ചരിത്രം' },
  // { path: '/inventory/update-reorder-threshold', icon: 'fas fa-sliders-h', label: 'റീഓർഡർ പരിധി അപ്‌ഡേറ്റ് ചെയ്യുക' }
];
</script>

<style scoped>
.sidebar.collapsed {
  width: 4rem;
}
</style>
