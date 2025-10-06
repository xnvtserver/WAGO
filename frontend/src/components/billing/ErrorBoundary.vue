<template>
  <div v-if="error"
    class="error-boundary p-4 sm:p-6 bg-red-100 border-2 border-red-300 text-red-700 rounded-lg shadow-lg m-4 flex flex-col items-center justify-center min-h-screen">
    <div class="text-center">
      <i class="fas fa-exclamation-triangle text-4xl sm:text-5xl text-red-500 mb-3"></i>
      <h3 class="font-bold text-xl sm:text-2xl mb-2">ഒരു പിശക് സംഭവിച്ചു!</h3>
      <p class="text-sm sm:text-base mb-4 text-gray-700">
        {{ error.message || 'അജ്ഞാതമായ ഒരു പിശക് സംഭവിച്ചു. ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക.' }}
      </p>
      <button @click="$emit('retry')"
        class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-md transition-colors duration-150 text-sm sm:text-base flex items-center justify-center">
        <i class="fas fa-redo mr-2"></i> വീണ്ടും ശ്രമിക്കുക
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ error: Error | null }>();
defineEmits(['retry']);
</script>