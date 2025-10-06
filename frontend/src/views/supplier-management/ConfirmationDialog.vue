<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmation</h3>
      <p class="text-gray-700 mb-6">{{ message }}</p>
      <div class="flex justify-end space-x-3">
        <button 
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition"
        >
          Cancel
        </button>
        <button 
          @click="$emit('confirm')"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: { type: String, required: true },
    visible: { type: Boolean, default: false }
  },
  emits: ['confirm', 'cancel']
};
</script>