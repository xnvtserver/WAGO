<!-- front-end/src/components/productCreation/productAdd.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="pageLoading" class="text-center py-8">
      <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
      <p class="mt-2 text-gray-600">{{ loadingMessage }}</p>
    </div>

    <div v-else-if="pageLoadError" class="text-center p-8 text-red-500">
      <p>ഷോപ്പ് വിവരങ്ങൾ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല!</p>
      <button @click="initializePage" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        വീണ്ടും ശ്രമിക്കുക
      </button>
    </div>

    <div v-else class="container mx-auto px-4 py-8">
      <form @submit.prevent="submitForm">
        <header class="flex justify-between items-center mb-8">
          <div class="flex items-center">
            <div v-if="activeShopDetails?.name"
              class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl mr-3">
              {{ activeShopInitial }}
            </div>
            <div v-else class="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-3"></div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">പുതിയ ഉൽപ്പന്നം സൃഷ്ടിക്കുക</h1>
              <p class="text-sm text-gray-500" v-if="activeShopDetails?.name">ഷോപ്പ്: {{ activeShopDetails.name }}</p>
              <p class="text-sm text-gray-300" v-else>ഷോപ്പ് തിരഞ്ഞെടുത്തിട്ടില്ല</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button type="button" @click="cancelForm"
              class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg">
              <i class="fas fa-times mr-2"></i> റദ്ദാക്കുക
            </button>
            <button type="submit" :disabled="isSubmitting || !productForm.shop_id"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50">
              <i class="fas fa-save mr-2"></i>
              {{ isSubmitting ? 'സേവ് ചെയ്യുന്നു...' : 'സംരക്ഷിക്കുക' }}
            </button>
          </div>
        </header>

        <!-- multiple shop selection no included in initial version -->
        <!-- <div v-if="authStore.shops.length > 1" class="mb-6 bg-white p-4 rounded-lg shadow">
          <label class="block text-gray-700 mb-2 font-medium">ഷോപ്പ് തിരഞ്ഞെടുക്കുക</label>
          <select v-model="authStore.activeShop" @change="handleShopSelectionChange"
            class="w-full p-3 border border-gray-300 rounded-md input-highlight">
            <option v-for="shop in authStore.shops" :key="shop.id" :value="shop.id">
              {{ shop.name }}
            </option>
          </select>
        </div> -->

        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="border-b border-gray-200">
            <div class="flex overflow-x-auto">
              <button type="button" class="tab-button px-6 py-3 font-medium text-sm border-b-2 border-transparent"
                :class="{ 'active': activeTab === 'basic-info' }" @click="activeTab = 'basic-info'">
                <i class="fas fa-info-circle mr-2"></i> അടിസ്ഥാന വിവരങ്ങൾ
              </button>
              <button type="button" class="tab-button px-6 py-3 font-medium text-sm border-b-2 border-transparent"
                :class="{ 'active': activeTab === 'pricing' }" @click="setActiveTab('pricing')">
                <i class="fas fa-tag mr-2"></i> വിലനിർണ്ണയം
              </button>
            </div>
          </div>

          <div class="p-6">
            <div v-if="successMessage" class="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <i class="fas fa-check-circle text-green-500"></i>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-green-700">{{ successMessage }}</p>
                </div>
              </div>
            </div>

            <div v-if="errorMessage" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <i class="fas fa-exclamation-circle text-red-500"></i>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">{{ errorMessage }}</p>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'basic-info'">
              <ProductBasicInfo :form="productForm" :categories="categories">
                <template #image-upload>
                  <ProductImageUpload 
                  :form="productForm"
                  :preview-url="productForm.imagePreviewUrl"
                   @file-selected="handleFileSelected"
                    @remove-image="handleRemoveImage" />

                </template>
              </ProductBasicInfo>
            </div>
            <div v-if="activeTab === 'pricing'">
              <ProductPricing :form="productForm" />
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import ProductImageUpload from '@/components/productCreation/ProductImageUpload.vue';
import { ref, onMounted, watch, computed, nextTick, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import ProductBasicInfo from './ProductBasicInfo.vue';
import ProductPricing from './ProductPricing.vue';

const authStore = useAuthStore();
const router = useRouter();

// State
const pageLoading = ref(true);
const pageLoadError = ref(false);
const loadingMessage = ref('ഷോപ്പ് വിവരങ്ങൾ ലോഡ് ചെയ്യുന്നു...');
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const activeTab = ref('basic-info');
const fileInputRef = ref(null);

// // FIX 1: Add nextTick for tab switching
const setActiveTab = async (tabName) => {
  activeTab.value = tabName;
  // await nextTick();
};
// Categories
const categories = ref([
  'പ്രധാന ഭക്ഷണം', 'അവശ്യസാധനങ്ങൾ ', 'പച്ചക്കറികൾ ', 'പാനീയങ്ങൾ', 'സ്റ്റേഷണറി സാധനങ്ങൾ',
  'ക്ലീനിംഗ് ഉൽപ്പന്നങ്ങൾ', 'ഇലക്ട്രോണിക്സ്', 'വസ്ത്രങ്ങൾ', 'വീട് & അടുക്കള', 'മറ്റുള്ളവ'
]);

// Form
const initialProductFormState = () => ({
  name: '',
  description: '',
  sku: '',
  barcode: '',
  category: 'പ്രധാന ഭക്ഷണം',
  brand: '',
  unit: '',
  unit_value: 1,
  is_active: true,
  retail_price: null,
  wholesale_price: null,
  purchase_price: null,
  stock: null,
  shop_id: null,
  image: null,
  imagePreviewUrl: '',
});

const productForm = ref(initialProductFormState());

// Computed
const activeShopDetails = computed(() => {
  return authStore.shops.find(shop => shop.id === authStore.activeShop) || null;
});

const activeShopInitial = computed(() => {
  return activeShopDetails.value?.name?.charAt(0).toUpperCase() || '';
});


const handleFileSelected = async (file) => {
  if (productForm.value.imagePreviewUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(productForm.value.imagePreviewUrl);
  }

  productForm.value.image = file;

  // Wait for DOM updates to complete
  await nextTick();

  // Delay setting blob URL to give slot/component time to mount
  setTimeout(() => {
    try {
      productForm.value.imagePreviewUrl = URL.createObjectURL(file);
      console.log('Preview URL set to:', productForm.value.imagePreviewUrl);
    } catch (e) {
      console.error('Failed to set preview URL:', e);
    }
  }, 10); // even 10ms helps prevent the "parent is null" error
};




const handleRemoveImage = () => {
  if (productForm.value.imagePreviewUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(productForm.value.imagePreviewUrl);
  }
  productForm.value.image = null;
  productForm.value.imagePreviewUrl = '';
};

// // Initialization
const initializePage = async () => {

  pageLoading.value = true;
  pageLoadError.value = false;
  loadingMessage.value = 'ഷോപ്പ് വിവരങ്ങൾ ലോഡ് ചെയ്യുന്നു...';

  try {
    if (!authStore.isInitialized) await authStore.initialize();

    if (!authStore.isAuthenticated) {
      router.push('/login');
      return;
    }

    if (authStore.shops.length === 0) {
      await authStore.fetchShops();
    }

    if (authStore.shops.length > 0) {
      if (!authStore.activeShop || !authStore.shops.find(s => s.id === authStore.activeShop)) {
        authStore.setActiveShop(authStore.shops[0].id);
      }
      productForm.value.shop_id = authStore.activeShop;
    } else if (authStore.user?.shop_id) {
      productForm.value.shop_id = authStore.user.shop_id;
      if (!authStore.activeShop) {
        authStore.setActiveShop(authStore.user.shop_id);
      }
    } else {
      pageLoadError.value = true;
      errorMessage.value = 'ഉൽപ്പന്നങ്ങൾ ചേർക്കാൻ നിങ്ങൾക്ക് ഷോപ്പുകളൊന്നും നിലവിൽ അനുവദിച്ചിട്ടില്ല.';
    }
  } catch (error) {
    console.error('Page initialization failed:', error);
    pageLoadError.value = true;
    errorMessage.value = error?.message || 'ഷോപ്പ് വിവരങ്ങൾ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.';
  } finally {
    pageLoading.value = false;
  }
};

// Handlers
const handleShopSelectionChange = (event) => {
  const selectedShopId = Number(event.target.value);
  authStore.setActiveShop(selectedShopId);
};

// FIX 4: Safer form reset
const resetForm = () => {
  // Revoke image URL
  if (productForm.value.imagePreviewUrl) {
    if (productForm.value.imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(productForm.value.imagePreviewUrl);
    }
    productForm.value.imagePreviewUrl = '';

  }

  // Reset form while preserving shop ID
  const currentShopId = productForm.value.shop_id;
  Object.assign(productForm.value, {
    ...initialProductFormState(),
    shop_id: currentShopId
  });

  // Reset file input
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};
// Add this before form submission
const validateForm = () => {
  if (!productForm.value.name.trim()) {
    errorMessage.value = "Product name is required";
    return false;
  }
  if (!productForm.value.sku.trim()) {
    errorMessage.value = "SKU is required";
    return false;
  }
  // Add other validations as needed
  return true;
};

const submitForm = async () => {
  successMessage.value = '';
  errorMessage.value = '';
  if (!validateForm()) return;

  if (!productForm.value.shop_id) {
    errorMessage.value = 'ഷോപ്പ് ഐഡി ലഭ്യമല്ല. ദയവായി ഒരു ഷോപ്പ് തിരഞ്ഞെടുക്കുക.';
    return;
  }

  isSubmitting.value = true;

  const formData = new FormData();

  // Append all fields except image
  const fields = [
    'name', 'description', 'sku', 'barcode', 'category',
    'brand', 'unit', 'unit_value', 'retail_price',
    'wholesale_price', 'purchase_price', 'stock', 'shop_id'
  ];

  fields.forEach(field => {
    formData.append(field, productForm.value[field]);
  });

  // Handle boolean separately
  formData.append('is_active', productForm.value.is_active ? 'true' : 'false');

  // Append image file if provided
  if (productForm.value.image instanceof File) {
    formData.append('image', productForm.value.image, productForm.value.image.name);
  }

  // ✅ Debug log FormData
  for (const [key, value] of formData.entries()) {
    console.log(`FormData → ${key}:`, value);
  }

  try {
    const response = await authStore.apiFetch(`/ProductAndPricingRoutes/shops/${productForm.value.shop_id}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData
    });

    successMessage.value = response.message || 'ഉൽപ്പന്നം വിജയകരമായി ചേർത്തു!';
    resetForm();
    setTimeout(() => {
      router.push({ name: 'Products' }); // Removed nextTick
    }, 2000);
  } catch (error) {
    console.error('Product creation failed:', error);

    const status = error?.response?.status;
    const data = error?.response?.data;

    if (status === 401) {
      errorMessage.value = 'അംഗീകാരമില്ല. ദയവായി വീണ്ടും ലോഗിൻ ചെയ്യുക.';
    } else if (status === 409) {
      errorMessage.value = data?.error || 'SKU അല്ലെങ്കിൽ ബാർകോഡ് ഡുപ്ലിക്കേറ്റാണ്. ദയവായി വേറിട്ടത് നൽകുക.';
    } else if (data?.errors) {
      const validationErrors = Object.values(data.errors).flat().join(' ');
      errorMessage.value = `ഫോം പിശകുകൾ: ${validationErrors}`;
    } else if (data?.message || data?.error) {
      errorMessage.value = data.message || data.error;
    } else {
      errorMessage.value = error?.message || 'ഉൽപ്പന്നം സൃഷ്ടിക്കുന്നതിൽ പിശക് സംഭവിച്ചു.';
    }
  } finally {
    isSubmitting.value = false;
  }
};

// FIX 5: Use nextTick in navigation
const cancelForm = () => {
  if (confirm('...')) {
    resetForm();
    router.push({ name: 'Products' }); // Removed nextTick
  }
};
// Add component unmount cleanup
onUnmounted(() => {
  if (productForm.value.imagePreviewUrl) {
    URL.revokeObjectURL(productForm.value.imagePreviewUrl);
  }
});
onMounted(() => {
  initializePage();
});
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
/* For icons */

.min-h-screen {
  /* Ensure font is applied to the whole component */
  font-family: 'Noto Sans Malayalam', sans-serif;
}

.tab-button {
  transition: all 0.2s ease;
  color: #4b5563;
  /* gray-600 */
}

.tab-button:hover {
  color: #1d4ed8;
  /* blue-700 */
}

.tab-button.active {
  color: #2563eb;
  /* blue-600 */
  border-color: #2563eb;
  /* blue-600 */
  font-weight: 600;
  /* semibold */
}

.input-highlight {
  transition: all 0.2s ease;
}

.input-highlight:focus {
  border-color: #3b82f6;
  /* blue-500 */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  outline: none;
}

/* Price type card styles are kept if you want to re-introduce dynamic pricing types later */
.price-type-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.price-type-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.price-type-card.selected {
  border-color: #3b82f6;
  /* blue-500 */
  background-color: #eff6ff;
  /* blue-50 */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

/* Additional fine-tuning for consistency if needed */
label {
  margin-bottom: 0.25rem;
  /* mb-1 */
  display: block;
}
</style>