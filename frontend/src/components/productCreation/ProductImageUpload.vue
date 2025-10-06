<!-- front-end/src/components/productCreation/ProductImageUpload.vue -->
<template>
  <div class="mb-6">
    <label class="block text-sm font-medium text-gray-700 mb-2">ഉൽപ്പന്ന ചിത്രം</label>
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
<div v-if="form.imagePreviewUrl" class="h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
  <img
    :src="form.imagePreviewUrl"
    alt="Product Image"
    class="object-contain h-full w-full"
  />
</div>

      <p v-if="!previewUrl" class="text-sm text-gray-500 mb-2">ചിത്രം അപ്ലോഡ് ചെയ്യുക</p>
      <input type="file" @change="handleFileChange" accept="image/*" class="hidden" ref="fileInputRef" />
      <div v-if="previewUrl" class="flex justify-center space-x-2">
        <button type="button" @click="triggerFileSelect" 
                class="bg-blue-50 text-blue-600 text-sm font-medium py-1 px-3 rounded">
          <i class="fas fa-sync mr-1"></i> മാറ്റുക
        </button>
        <button type="button" @click="removeImage" 
                class="bg-red-50 text-red-600 text-sm font-medium py-1 px-3 rounded">
          <i class="fas fa-trash mr-1"></i> നീക്കം ചെയ്യുക
        </button>
      </div>
      <button v-else type="button" @click="triggerFileSelect" 
              class="bg-blue-50 text-blue-600 text-sm font-medium py-1 px-3 rounded">
        <i class="fas fa-upload mr-1"></i> ഫയൽ തിരഞ്ഞെടുക്കുക
      </button>
      <p class="text-xs text-gray-400 mt-2">JPG, PNG, max 5MB</p>
      <p v-if="localError" class="text-xs text-red-500 mt-2">{{ localError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref , watch , onMounted } from 'vue';
import { BASE_IMAGE_URL } from '@/utils/constants';

const emit = defineEmits(['file-selected', 'remove-image']);
const props = defineProps({
  previewUrl: String,
  form: Object
});
const fileInputRef = ref(null);
const localError = ref('');
const internalPreviewUrl = ref(props.previewUrl);

// ✅ FIX: sync prop changes to internalPreviewUrl
watch(() => props.previewUrl, (newUrl) => {
  internalPreviewUrl.value = newUrl;
});

onMounted(() => {
  console.log('ProductImageUpload mounted');
});


const triggerFileSelect = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (event) => {
  const file = event.target.files?.[0];
  localError.value = '';

  if (!file) return;

  // Validate file
  const validTypes = ['image/jpeg', 'image/png'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    localError.value = 'സപ്പോർട്ടുചെയ്യുന്ന ഫോർമാറ്റുകൾ: JPG, PNG മാത്രം';
    return;
  }

  if (file.size > maxSize) {
    localError.value = 'പരമാവധി ഫയൽ വലുപ്പം 5MB ആണ്';
    return;
  }

  emit('file-selected', file);
};

const removeImage = () => {
    fileInputRef.value.value = '';
  emit('remove-image');
};
</script>