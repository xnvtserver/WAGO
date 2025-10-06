<!-- src/views/settings/settings.vue -->
<template>
  <div class="h-screen bg-gray-100 font-sans">
    <div class="flex h-screen overflow-hidden">
      <!-- Desktop Sidebar -->
      <SettingsSidebar :current-tab="currentTab" @change-tab="changeTab" />
      
      <!-- Main Content -->
      <div class="flex flex-col flex-1 overflow-hidden">
        <TopNavigation :title="pageTitle" @toggle-sidebar="isMobileSidebarOpen = !isMobileSidebarOpen" />
        
        <!-- Content Area -->
        <div class="flex-1 overflow-auto p-4">
          <component :is="currentTabComponent" class="animate-fade-in" />
        </div>
      </div>

      <!-- Mobile Sidebar -->
      <MobileSidebar 
        :is-open="isMobileSidebarOpen"
        :current-tab="currentTab"
        @close="isMobileSidebarOpen = false"
        @change-tab="changeTab"
      />
    </div>
    </div>
    <!-- Modals -->
    <AddUserModal v-if="showAddUserModal" @close="showAddUserModal = false" />
    <EditUserModal v-if="showEditUserModal" @close="showEditUserModal = false" />
    <AddTaxModal v-if="showAddTaxModal" @close="showAddTaxModal = false" />
    <RouterView /> <!-- Add router-view for nested routes -->
</template>

<script setup>
import { ref, computed } from 'vue';
import SettingsSidebar from '@/components/settings/SettingsSidebar.vue';
import MobileSidebar from '@/components/settings/MobileSidebar.vue';
import TopNavigation from '@/components/settings/TopNavigation.vue';
import StoreInfo from '@/components/settings/StoreInfo.vue';
import UserManagement from '@/components/settings/UserManagement.vue';
import TaxSettings from '@/components/settings/TaxSettings.vue';
import AddUserModal from '@/components/settings/AddUserModal.vue';
import EditUserModal from '@/components/settings/EditUserModal.vue';
import AddTaxModal from '@/components/settings/AddTaxModal.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const router = useRouter();

const currentTab = ref('store-info');
const isMobileSidebarOpen = ref(false);
const showAddUserModal = ref(false);
const showEditUserModal = ref(false);
const showAddTaxModal = ref(false);
// Validate permissions on component mount
console.log(authStore.user.permissions);
console.log('Current user:', authStore.user);
console.log('Has permission view_settings?', authStore.hasPermission('view_settings'));

if (!authStore.hasPermission('view_settings')) {
  router.replace('/dashboard');
}
const pageTitle = computed(() => {
  const titles = {
    'store-info': 'Store Information',
    'user-management': 'User Management',
    'tax-settings': 'Tax Settings'
  };
  return titles[currentTab.value];
});

const currentTabComponent = computed(() => {
  const components = {
    'store-info': StoreInfo,
    'user-management': UserManagement,
    'tax-settings': TaxSettings
  };
  return components[currentTab.value];
});

function changeTab(tab) {
  currentTab.value = tab;
  isMobileSidebarOpen.value = false;
}
</script>