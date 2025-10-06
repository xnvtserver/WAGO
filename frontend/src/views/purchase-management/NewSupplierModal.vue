<template>
  <Modal title="Add New Supplier" @close="$emit('close')">
    <form class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Form fields -->
      </div>
    </form>
    
    <template #footer>
      <button 
        type="button" 
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm"
        @click="$emit('save', newSupplier)"
      >
        Save Supplier
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

const newSupplier = ref({
  // Form data structure
});
</script>