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
    <img :src="logo" alt="Company Logo" class="w-full h-full object-contain" />
  </div>

  <span v-if="!collapsed" class="logo-text ml-3 font-bold text-xl">വ്യാപാര നടത്തിപ്പ്</span>
</div>


    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto">
      <div class="p-2">
        <!-- Main -->
        <div class="mb-1 text-xs uppercase font-semibold px-4 py-2"
             :class="theme.isDark ? 'text-indigo-400' : 'text-gray-500'">
          <span v-if="!collapsed">Main</span>
        </div>

        <router-link
          to="/dashboard"
          class="nav-item flex items-center px-4 py-3 rounded-lg mx-2 mb-1"
          :class="theme.isDark ? 'text-white bg-indigo-900' : 'text-black bg-indigo-100 hover:bg-indigo-200'"
        >
          <i class="fas fa-tachometer-alt"></i>
          <span v-if="!collapsed" class="nav-text ml-3">Dashboard</span>
        </router-link>

        <!-- Operations -->
        <div class="mb-1 text-xs uppercase font-semibold px-4 py-2"
             :class="theme.isDark ? 'text-indigo-400' : 'text-gray-500'">
          <span v-if="!collapsed">Operations</span>
        </div>
        <router-link
          v-for="link in operationsLinks"
          :key="link.path"
          :to="link.path"
          class="nav-item flex items-center px-4 py-3 rounded-lg mx-2 mb-1"
          :class="theme.isDark ? 'text-white hover:bg-indigo-700' : 'text-black hover:bg-indigo-100'"
        >
          <i :class="link.icon"></i>
          <span v-if="!collapsed" class="nav-text ml-3">{{ link.label }}</span>
        </router-link>

        <!-- Management -->
        <div class="mb-1 text-xs uppercase font-semibold px-4 py-2"
             :class="theme.isDark ? 'text-indigo-400' : 'text-gray-500'">
          <span v-if="!collapsed">Management</span>
        </div>
        <router-link
          v-for="link in managementLinks"
          :key="link.path"
          :to="link.path"
          class="nav-item flex items-center px-4 py-3 rounded-lg mx-2 mb-1"
          :class="theme.isDark ? 'text-white hover:bg-indigo-700' : 'text-black hover:bg-indigo-100'"
        >
          <i :class="link.icon"></i>
          <span v-if="!collapsed" class="nav-text ml-3">{{ link.label }}</span>
        </router-link>

        <!-- Multi-Store -->
        <!-- <div class="mb-1 text-xs uppercase font-semibold px-4 py-2"
             :class="theme.isDark ? 'text-indigo-400' : 'text-gray-500'">
          <span v-if="!collapsed">Multi-Store</span>
        </div>
        <router-link
          to="/stores"
          class="nav-item flex items-center px-4 py-3 rounded-lg mx-2 mb-1"
          :class="theme.isDark ? 'text-white hover:bg-indigo-700' : 'text-black hover:bg-indigo-100'"
        >
          <i class="fas fa-store"></i>
          <span v-if="!collapsed" class="nav-text ml-3">Store Locations</span>
        </router-link> -->
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { useAuthStore } from '../../stores/auth';
import logo from '@/assets/logo.png' // adjust path alias if needed

const theme = useThemeStore();
onMounted(theme.initTheme);

// Responsive collapsed state
const collapsed = ref(false);

const handleResize = () => {
  collapsed.value = window.innerWidth < 768;
};

onMounted(() => {
  handleResize(); // Initial check
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
const shopId = useAuthStore.user?.shop_id; //shopid
const operationsLinks = [
  { path: '/billing', icon: 'fas fa-cash-register', label: 'ബിൽ തയ്യാറാക്കൽ' },
  { path: '/products/add', icon: 'fas fa-plus-square', label: 'ഉൽപ്പന്നം ചേർക്കുക' },
  // { path: '/product-price', icon: 'fas fa-rupee-sign', label: 'വില നിയന്ത്രണം ' },
  { path: '/inventory', icon: 'fas fa-boxes', label: 'ഇൻവെൻററി മാനേജ്മെൻറ്' },
  { path: `/sales/saleshistory/${shopId}`, icon: 'fas fa-history', label: 'വിൽപ്പന ചരിത്രം' },
  { path: '/purchaseManagement', icon: 'fas fa-boxes', label: 'പർചേസ് മാനേജ്മെൻറ്' },
  // { path: '/finance', icon: 'fas fa-file-invoice-dollar', label: 'സാമ്പത്തികം ' },
  // { path: '/reports', icon: 'fas fa-chart-line', label: 'റിപ്പോർട്ടുകൾ ' }
];

const managementLinks = [
  // { path: '/customers', icon: 'fas fa-users', label: 'Customers' },
  { path: '/SupplierManagement', icon: 'fas fa-user-tie', label: 'Suppliers' },
  // { path: '/staff', icon: 'fas fa-users-cog', label: 'Staff' },
  // { path: '/shops/${shopId}/permissions', icon: 'fas fa-users-cog', label: 'Manage-Permissions' }
];
</script>

<style scoped>
.sidebar.collapsed {
  width: 4rem;
}
</style>
