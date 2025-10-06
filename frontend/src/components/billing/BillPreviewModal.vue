front-end/src/components/billing/BillPreviewModal.vue
<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50 transition-opacity duration-300"
    @click.self="$emit('close')">
    <div class="bg-white rounded-lg w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto shadow-xl">
      <!-- Bill Preview Content -->
      <div class="text-center mb-4 sm:mb-5">
        <h2 class="text-xl sm:text-2xl font-bold text-green-700">{{ shopDetails.name }}</h2>
        <p class="text-xs sm:text-sm text-gray-600">{{ shopDetails.address }}</p>
        <p class="text-xs sm:text-sm text-gray-600 mt-1">ഫോൺ: {{ shopDetails.phone }}</p>
        <p class="text-xs sm:text-sm text-gray-500 mt-2">ബിൽ നമ്പർ: {{ billNumber }}</p>
        <p class="text-xs sm:text-sm text-gray-500">തീയതി: {{ formattedDate }}</p>
      </div>

      <!-- Customer Details -->
      <div v-if="customer.name || customer.phone || customer.address"
        class="border-t border-b border-gray-200 py-2 my-3 text-xs sm:text-sm">
        <h3 class="font-semibold text-gray-700 mb-1.5">ഉപഭോക്താവ്:</h3>
        <div v-if="customer.name" class="flex justify-between">
          <span class="text-gray-600">പേര്:</span>
          <span class="font-medium text-gray-800">{{ customer.name }}</span>
        </div>
        <!-- Other customer details -->
      </div>

      <!-- Bill Items -->
      <div class="mb-3 sm:mb-4">
        <table class="w-full text-left text-xs sm:text-sm">
          <!-- Table content -->
           <thead>
      <tr class="border-b">
        <th class="py-1">പേര്</th>
        <th class="text-right py-1">അളവ്</th>
        <th class="text-right py-1">തുക</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in billItems" :key="item.id">
        <td class="py-1">{{ item.name }}</td>
        <td class="text-right py-1">{{ item.quantity.toFixed(2) }} കിലോ</td>
        <td class="text-right py-1">₹{{ (item.quantity * item.price).toFixed(2) }}</td>
      </tr>
    </tbody>
        </table>
      </div>

      <!-- Payment QR -->
      <div class="mt-4 border-t pt-4 text-center">
        <p class="text-sm text-gray-600 mb-2">സ്കാൻ ചെയ്ത് പണം അടയ്ക്കുക</p>
        <qrcode-vue :value="upiPaymentUrl" :size="160" level="H" class="mx-auto mb-2" />
        <p class="text-xs text-gray-500">{{ shopDetails.upiId }}</p>
      </div>

      <!-- Actions -->
 <div class="mt-5 sm:mt-6 flex flex-col sm:flex-row justify-around space-y-2 sm:space-y-0 sm:space-x-3">
        <button @click="handlePrint"
          class="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-150 text-sm sm:text-base">
          <i class="fas fa-print mr-1.5"></i> പ്രിന്റ്
        </button>
        <button @click="handleClose"
          class="w-full sm:w-auto flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-150 text-sm sm:text-base">
          <i class="fas fa-times mr-1.5"></i> അടയ്ക്കുക
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  show: boolean;
  billNumber: string;
  customer: any;
  items: any[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  gstRate: number;
  discountRate: number;
  shopDetails: any;
  upiId?: string;
}>();

defineEmits(['close', 'print']);
</script>
<!-- <script setup>
import { computed } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { useBilling } from '@/composables/useBilling';

// Setup emit handler correctly
const emit = defineEmits(['close', 'print']);

// Destructure composable functions
const { printBill, closeBillPreview } = useBilling();

// Define props
const props = defineProps({
  show: Boolean,
  billItems: Array,
  customer: Object,
  shopDetails: Object,
  billNumber: String,
  subtotal: Number,
  discount: Number,
  tax: Number,
  total: Number,
  upiId: String
});

// Handle close
const handleClose = () => {
  closeBillPreview(); // update composable state
  emit('close');      // notify parent
};

// Handle print
const handlePrint = () => {
  printBill();
  closeBillPreview(); // update state
  emit('close');      // notify parent
};

// Computed properties
const formattedDate = computed(() =>
  new Date().toLocaleDateString('ml-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
);

const upiPaymentUrl = computed(() =>
  `upi://pay?pa=${props.upiId || props.shopDetails?.upiId}&am=${props.total?.toFixed(2)}&cu=INR`
);
</script> -->
