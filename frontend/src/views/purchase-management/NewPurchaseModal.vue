<template>
  <Modal title="New Purchase Order" @close="$emit('close')">
    <form class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Form fields -->
      </div>
      
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Items</label>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Items table -->
          </table>
        </div>
        <button 
          type="button" 
          class="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20"
        >
          <i class="fas fa-plus mr-1"></i> Add Item
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <!-- Notes and summary -->
      </div>
    </form>
    
    <template #footer>
      <button 
        type="button" 
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 sm:ml-3 sm:w-auto sm:text-sm"
        @click="$emit('save', newPurchase)"
      >
        Create Purchase Order
      </button>
      <button 
        type="button" 
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="$emit('close')"
      >
        Cancel
      </button>
    </template>
  </Modal>
</template>

<script setup>
import Modal from './Modal.vue';
import { ref } from 'vue';

defineEmits(['close', 'save']);

const newPurchase = ref({
  // Form data structure
});
</script>