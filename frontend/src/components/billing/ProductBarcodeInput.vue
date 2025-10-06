<template>
  <div class="mb-4 sm:mb-5">
    <div class="relative">
      <input type="text" v-model.trim="modelValue" @keyup.enter="$emit('scan')"
        placeholder="സ്കാൻ ചെയ്യുക അല്ലെങ്കിൽ ബാർക്കോഡ് നൽകുക"
        class="w-full p-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm sm:text-base"
        :disabled="disabled" />
      <i class="fas fa-barcode absolute right-3 top-3.5 text-gray-400"></i>
    </div>
    <p v-if="error" class="text-red-500 text-sm mt-1.5">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  error?: string;
  disabled?: boolean;
}>();
defineEmits(['scan']);
</script>
<!-- <template>
  <div class="mb-4 sm:mb-5">
    <div class="relative">
      <i class="fas fa-barcode absolute right-3 top-3.5 text-gray-400"></i>
      <input 
        type="text" 
        ref="barcodeInputRef"
        v-model="barcodeInput"
        @keyup.enter="handleBarcodeEnter"
        @paste="handlePaste"
        placeholder="ബാർക്കോഡ്"
        class="w-full p-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-200 text-sm sm:text-base"
        :disabled="disabled || loading"
        autocomplete="off"
      />
    </div>
    <div v-if="loading" class="text-sm text-blue-500 mt-1">
      <i class="fas fa-spinner fa-spin mr-2"></i>
      Scanning barcode...
    </div>
    <p v-if="error" class="text-red-500 text-sm mt-1.5">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['barcode-scanned']);
const barcodeInput = ref('');
const barcodeInputRef = ref(null);
const loading = ref(false);
const error = ref('');

// Debounce scanner inputs
let processing = false;

const processBarcode = async (barcode) => {
  if (!barcode || processing) return;
  
  try {
    processing = true;
    loading.value = true;
    error.value = '';
    
    // Emit to parent component for product addition
    await emit('barcode-scanned', barcode);
    
    // Reset and prepare for next scan
    barcodeInput.value = '';
    await clearClipboard();
    
    // Immediate focus for next scan
    requestAnimationFrame(() => {
      barcodeInputRef.value?.focus();
    });
  } catch (err) {
    error.value = 'Failed to add product - please try again';
    console.error('Barcode processing error:', err);
  } finally {
    processing = false;
    loading.value = false;
  }
};

const handleBarcodeEnter = () => {
  const barcode = barcodeInput.value.trim();
  if (barcode) processBarcode(barcode);
};

const handlePaste = async (event) => {
  try {
    const pastedData = await navigator.clipboard.readText();
    const trimmed = pastedData.trim();
    
    if (trimmed) {
      event.preventDefault();
      await processBarcode(trimmed);
    }
  } catch (err) {
    error.value = 'Clipboard access failed - use scanner input';
    console.log('Paste error:', err);
  }
};

const clearClipboard = async () => {
  try {
    // Write empty string to prevent duplicate scans
    await navigator.clipboard.writeText('');
  } catch (err) {
    // Silent fail - some browsers block clipboard writes
  }
};

// Focus input on mount for immediate scanning
onMounted(() => {
  barcodeInputRef.value?.focus();
});

// Optimized for scanner behavior:
// - Auto-focus after processing
// - Debounced inputs
// - Clipboard management
// - Error recovery
</script> -->