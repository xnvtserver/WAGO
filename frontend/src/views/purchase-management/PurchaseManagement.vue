<template>
  <div
    :class="[
      'flex h-screen overflow-hidden',
      themeStore.isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    ]"
  >
    <!-- Reusable Sidebar -->
    <Sidebar :current-page="'purchases'" />

    <!-- Main Content -->
    <div
      class="content-area flex-1 overflow-y-auto transition-colors duration-300"
      :class="themeStore.isDark ? 'bg-gray-900' : 'bg-white'"
    >
      <!-- Reusable Top Navigation -->
      <TopNav title="Purchase Management" />

      <!-- Purchase Management Content -->
      <main class="p-6">
        <!-- Stats Cards -->
        <PurchaseStatsCards />

        <!-- Action Bar -->
        <PurchaseActionBar @new-purchase="showNewPurchaseModal = true" />

        <!-- Purchase Table -->
        <PurchaseTable @edit-purchase="handleEditPurchase" />

        <!-- Supplier Section -->
        <SupplierSection @add-supplier="showNewSupplierModal = true" />
      </main>
    </div>

    <!-- Modals -->
    <NewPurchaseModal 
      v-if="showNewPurchaseModal" 
      @close="showNewPurchaseModal = false" 
      @save="handleSavePurchase"
    />

    <NewSupplierModal 
      v-if="showNewSupplierModal" 
      @close="showNewSupplierModal = false" 
      @save="handleSaveSupplier"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useThemeStore } from '@/stores/theme';

import Sidebar from '@/components/dashboard/Sidebar.vue';
import TopNav from '@/components/dashboard/TopNav.vue';
import PurchaseStatsCards from './PurchaseStatsCards.vue';
import PurchaseActionBar from './PurchaseActionBar.vue';
import PurchaseTable from './PurchaseTable.vue';
import SupplierSection from './SupplierSection.vue';
import NewPurchaseModal from './NewPurchaseModal.vue';
import NewSupplierModal from './NewSupplierModal.vue';

const themeStore = useThemeStore();
const isDark = themeStore.isDark;

// Initialize theme from localStorage when this component loads
themeStore.initTheme();

const showNewPurchaseModal = ref(false);
const showNewSupplierModal = ref(false);

// Handle purchase actions
const handleEditPurchase = (purchase) => {
  console.log('Editing purchase:', purchase);
  // Implementation for editing purchase
};

const handleSavePurchase = (newPurchase) => {
  console.log('Saving new purchase:', newPurchase);
  showNewPurchaseModal.value = false;
};

const handleSaveSupplier = (newSupplier) => {
  console.log('Saving new supplier:', newSupplier);
  showNewSupplierModal.value = false;
};
</script>

<style scoped>
.content-area {
  transition: all 0.3s;
}

/* Ensure that the background transitions smoothly */
.bg-gray-900 {
  background-color: #1a202c;
}

.bg-gray-100 {
  background-color: #f7fafc;
}

.text-white {
  color: white;
}

.text-gray-900 {
  color: #1a202c;
}

@media (max-width: 768px) {
  .content-area {
    margin-left: 0 !important;
  }
}
</style>
