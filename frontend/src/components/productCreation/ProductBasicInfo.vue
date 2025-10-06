<template>
  <div class="grid md:grid-cols-3 gap-6 mb-8">
    <div class="md:col-span-2">
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">ഉൽപ്പന്നത്തിന്റെ പേര്*</label>
        <input type="text" v-model="form.name"
          class="w-full px-3 py-2 border border-gray-300 rounded-md input-highlight"
          placeholder="ഉൽപ്പന്നത്തിന്റെ പേര് നൽകുക" required>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">വിവരണം</label>
        <textarea v-model="form.description" class="w-full px-3 py-2 border border-gray-300 rounded-md input-highlight"
          rows="3" placeholder="ഉൽപ്പന്നത്തിന്റെ വിവരണം നൽകുക"></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">SKU കോഡ്*</label>
          <input type="text" v-model="form.sku"
            class="w-full px-3 py-2 border border-gray-300 rounded-md input-highlight" placeholder="SKU-001" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ബാർകോഡ്*</label>

          <div class="flex">
            <input type="text" id="barcode" v-model="form.barcode"
              class="w-full px-3 py-2 border border-gray-300 rounded-l-md input-highlight" placeholder="8901234567890"
              required>
            <button type="button" @click="openScanner"
              class="bg-gray-100 border border-l-0 border-gray-300 px-3 rounded-r-md">
              <i class="fas fa-barcode"></i>
            </button>
          </div>

        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">വിഭാഗം*</label>
          <select v-model="form.category" class="w-full px-3 py-2 border border-gray-300 rounded-md input-highlight"
            required>
            <option value="" disabled hidden>വിഭാഗം തിരഞ്ഞെടുക്കുക</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ബ്രാൻഡ്*</label>
          <input type="text" v-model="form.brand"
            class="w-full px-3 py-2 border border-gray-300 rounded-md input-highlight" placeholder="ബ്രാൻഡ് നൽകുക"
            required>
        </div>
      </div>
    </div>

    <div>
      <slot name="image-upload"></slot>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">യൂണിറ്റ് തരം*</label>
        <select v-model="form.unit" class="w-full px-3 py-2 border border-gray-300 rounded-md input-highlight" required>
          <option value="" disabled>തിരഞ്ഞെടുക്കുക</option>
          <option value="kg">കിലോഗ്രാം (kg)</option>
          <option value="g">ഗ്രാം (g)</option>
          <option value="l">ലിറ്റർ (l)</option>
          <option value="ml">മില്ലി ലിറ്റർ (ml)</option>
          <option value="piece">കഷണം</option>
          <option value="pack">പാക്കറ്റ്</option>
        </select>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">യൂണിറ്റ് മൂല്യം*</label>
        <input type="number" v-model.number="form.unit_value"
          class="w-full px-3 py-2 border border-gray-300 rounded-md input-highlight" placeholder="1" min="0.01"
          step="0.01" required>
      </div>

      <div class="flex items-center">
        <input type="checkbox" id="isActive" v-model="form.is_active"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
        <label for="isActive" class="ml-2 block text-sm text-gray-700">
          ഉൽപ്പന്നം സജീവമാണ്
        </label>
      </div>
    </div>

    <!-- Barcode Scanner Modal -->
    <!-- Scanner Modal -->
    <div v-if="isScanning" class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">ബാർകോഡ് സ്കാനർ</h3>
          <button @click="closeScanner" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden mb-4">
          <qrcode-stream v-if="cameraActive" :camera="cameraStatus" @decode="onDecode" @init="onInit"
            @error="onCameraError" class="w-full h-full object-cover" />
          <div v-else class="absolute inset-0 flex items-center justify-center text-blue-500">
            <i class="fas fa-spinner fa-spin text-2xl"></i>
            <p class="ml-2">സ്കാനർ ലോഡുചെയ്യുന്നു...</p>
          </div>
        </div>

        <div v-if="scanError" class="text-red-600 text-sm mb-4 text-center">
          {{ scanError }}
        </div>

        <div class="flex justify-between">
          <button @click="switchCamera" class="px-4 py-2 bg-blue-600 text-white rounded-md">
            <i class="fas fa-camera-rotate mr-2"></i> ക്യാമറ മാറ്റുക
          </button>
          <button @click="closeScanner" class="px-4 py-2 bg-gray-500 text-white rounded-md">
            <i class="fas fa-times mr-2"></i> അടയ്ക്കുക
          </button>
        </div>

      </div>
        <!-- Visual Frame -->
  <!-- <div class="absolute top-1/2 left-1/2 w-48 h-48 border-4 border-blue-500 rounded transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"></div> -->

  <!-- Lighting suggestion -->
  <!-- <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 text-xs rounded z-20">
    ദയവായി പ്രകാശം ഉറപ്പാക്കുക
  </div> -->
      
    </div>



  </div>
</template>

<script setup>
import { ref } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader';

defineProps({
  form: Object,
  categories: Array
});

defineEmits(['file-selected', 'remove-image']);


// Scanner state
const isScanning = ref(false);
const cameraActive = ref(false);
const cameraStatus = ref('environment'); // forces rear camera on supported devices
const scanError = ref(null);

// Scanner functions
const openScanner = () => {
  isScanning.value = true;
  cameraActive.value = true;
  scanError.value = null;
};

const closeScanner = () => {
  isScanning.value = false;
  cameraActive.value = false;
};

const switchCamera = () => {
  cameraStatus.value = cameraStatus.value === 'environment' ? 'user' : 'environment';
};

const onDecode = (result) => {
  if (result) {
    props.form.barcode = result;
    closeScanner();
  }
};

const onInit = async (promise) => {
  try {
    await promise;
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      scanError.value = 'ക്യാമറ ആക്സസ് നിരസിച്ചു. ദയവായി പെർമിഷൻ അനുവദിക്കുക';
    } else if (error.name === 'NotFoundError') {
      scanError.value = 'ക്യാമറ കണ്ടെത്താൻ സാധിച്ചില്ല';
    } else if (error.name === 'NotSupportedError') {
      scanError.value = 'ബ്രൗസർ സുരക്ഷിതമായ കണക്ഷൻ (HTTPS) ആവശ്യമാണ്';
    } else if (error.name === 'NotReadableError') {
      scanError.value = 'ക്യാമറ ഇപ്പോൾ ഉപയോഗത്തിലാണ്';
    } else if (error.name === 'OverconstrainedError') {
      scanError.value = 'ക്യാമറ ആവശ്യകതകൾ പാലിക്കുന്നില്ല';
    } else {
      scanError.value = 'സ്കാനർ ആരംഭിക്കാൻ സാധിച്ചില്ല: ' + error.message;
    }
  }
};

const onCameraError = (error) => {
  console.error('Camera error:', error);
  scanError.value = 'ക്യാമറ പിശക്: ' + error.message;
};
</script>



<style scoped>
/* Optional: Add scanner frame styling */
.scanner-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 200px;
  border: 3px solid #3b82f6;
  border-radius: 8px;
  box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.4);
  z-index: 10;
}

#video-container {
  position: relative;
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.scanner-laser {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #ef4444;
  animation: laser 2s infinite;
}

@keyframes laser {
  0% {
    top: 0;
  }

  50% {
    top: 100%;
  }

  100% {
    top: 0;
  }
}
</style>