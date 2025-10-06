<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-2">
      <div class="p-3 md:p-4 border-b flex justify-between items-center">
        <h3 class="text-md md:text-lg font-semibold text-gray-800">{{ title }}</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="p-4 md:p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: { type: String, required: true }
  }
};
</script>