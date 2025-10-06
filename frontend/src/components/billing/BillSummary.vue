<template>
  <div class="lg:sticky lg:top-4 sm:top-6">
    <div class="bg-white rounded-xl shadow-lg bill-card p-3 sm:p-5">
      <h2 class="text-xl sm:text-2xl font-bold text-green-700 mb-4 border-b border-green-200 pb-3 flex justify-between items-center">
        <span>ബിൽ</span>
        <button v-if="cartItems.length > 0" @click="$emit('clear-cart')" title="Clear Cart"
          class="text-sm text-red-500 hover:text-red-700 font-medium transition-colors duration-150">
          <i class="fas fa-trash-alt mr-1"></i> ഒഴിവാക്കുക
        </button>
      </h2>
      <div class="space-y-2 mb-4 max-h-60 sm:max-h-72 overflow-y-auto custom-scrollbar pr-1">
        <div v-if="cartItems.length === 0" class="text-center py-6 text-gray-500">
          <i class="fas fa-shopping-cart text-2xl mb-2"></i>
          <p>ഇതുവരെ ഒന്നും തിരഞ്ഞെടുത്തിട്ടില്ല.</p>
        </div>
        <div v-for="item in cartItems" :key="item.id"
          class="flex justify-between items-center border-b border-gray-100 pb-2 last:border-b-0">
          <div>
            <span class="block font-medium text-gray-700 text-sm">{{ item.name }}</span>
            <span class="text-xs text-gray-500">{{ item.quantity.toFixed(2) }} കിലോ × ₹{{ item.price.toFixed(2) }}</span>
          </div>
          <span class="font-semibold text-gray-800 text-sm">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
      </div>

      <div class="border-t border-green-200 pt-3 space-y-1.5">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">ആകെ തുക</span>
          <span class="font-medium text-gray-700">₹{{ subtotal.toFixed(2) }}</span>
        </div>
        <div v-if="discount > 0" class="flex justify-between text-sm text-green-600">
          <span>ഡിസ്കൗണ്ട് ({{ (discountRate * 100).toFixed(0) }}%)</span>
          <span>-₹{{ discount.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">ജിഎസ്ടി ({{ (gstRate * 100).toFixed(0) }}%)</span>
          <span class="font-medium text-gray-700">₹{{ tax.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between font-bold text-lg sm:text-xl border-t border-gray-200 pt-2 mt-2">
          <span>മൊത്തം തുക</span>
          <span>₹{{ total.toFixed(2) }}</span>
        </div>
      </div>

      <button @click="$emit('generate-bill')" :disabled="processing || cartItems.length === 0"
        class="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 rounded-lg font-bold mt-5 sm:mt-6 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-base sm:text-lg">
        <i v-if="processing" class="fas fa-spinner fa-spin mr-2"></i>
        {{ processing ? 'തയ്യാറാക്കുന്നു...' : 'ബിൽ പ്രിന്റ് ചെയ്യുക' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  cartItems: any[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  gstRate: number;
  discountRate: number;
  processing?: boolean;
}>();

defineEmits(['clear-cart', 'generate-bill']);
</script>

<!-- front-end/src/components/billing/BillSummary.vue
<template>
  <div class="bg-white rounded-xl shadow-lg bill-card p-3 sm:p-5">
    <h2 class="text-xl sm:text-2xl font-bold text-green-700 mb-4 border-b border-green-200 pb-3 flex justify-between items-center">
      <span>ബിൽ</span>
      <button v-if="cartItems.length > 0" @click="$emit('clear-cart')" title="Clear Cart"
        class="text-sm text-red-500 hover:text-red-700 font-medium transition-colors duration-150">
        <i class="fas fa-trash-alt mr-1"></i> ഒഴിവാക്കുക
      </button>
    </h2>
    
    <div class="space-y-2 mb-4 max-h-60 sm:max-h-72 overflow-y-auto custom-scrollbar pr-1">
      <div v-if="cartItems.length === 0" class="text-center py-6 text-gray-500">
        <i class="fas fa-shopping-cart text-2xl mb-2"></i>
        <p>ഇതുവരെ ഒന്നും തിരഞ്ഞെടുത്തിട്ടില്ല.</p>
      </div>
      <div v-for="item in cartItems" :key="item.id"
        class="flex justify-between items-center border-b border-gray-100 pb-2 last:border-b-0">
        <div>
          <span class="block font-medium text-gray-700 text-sm">{{ item.name }}</span>
          <span class="text-xs text-gray-500">{{ item.quantity.toFixed(2) }} കിലോ × ₹{{ item.price.toFixed(2) }}</span>
        </div>
        <span class="font-semibold text-gray-800 text-sm">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
      </div>
    </div>

    <div class="border-t border-green-200 pt-3 space-y-1.5">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">ആകെ തുക</span>
        <span class="font-medium text-gray-700">₹{{ subtotal.toFixed(2) }}</span>
      </div>
      <div v-if="discount > 0" class="flex justify-between text-sm text-green-600">
        <span>ഡിസ്കൗണ്ട് ({{ (discountRate * 100).toFixed(0) }}%)</span>
        <span>-₹{{ discount.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">ജിഎസ്ടി ({{ (taxRate * 100).toFixed(0) }}%)</span>
        <span class="font-medium text-gray-700">₹{{ tax.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between font-bold text-lg sm:text-xl border-t border-gray-200 pt-2 mt-2">
        <span>മൊത്തം തുക</span>
        <span>₹{{ total.toFixed(2) }}</span>
      </div>
    </div>

    <button @click="$emit('generate-bill')" :disabled="cartItems.length === 0 || processingSale"
      class="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 rounded-lg font-bold mt-5 sm:mt-6 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-base sm:text-lg">
      <i v-if="processingSale" class="fas fa-spinner fa-spin mr-2"></i>
      {{ processingSale ? 'തയ്യാറാക്കുന്നു...' : 'ബിൽ പ്രിന്റ് ചെയ്യുക' }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  cartItems: Array,
  subtotal: Number,
  discount: Number,
  tax: Number,
  total: Number,
  discountRate: Number,
  taxRate: Number,
  processingSale: Boolean
});

defineEmits(['clear-cart', 'generate-bill']);
</script> -->