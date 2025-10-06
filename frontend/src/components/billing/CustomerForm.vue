<template>
  <div class="bg-white rounded-xl shadow-lg bill-card p-3 sm:p-5">
    <h2 class="text-xl sm:text-2xl font-bold text-green-700 mb-4 border-b border-green-200 pb-3">ഉപഭോക്തൃ വിവരങ്ങൾ</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="customerName" class="block text-sm font-medium text-gray-700 mb-1">പേര്</label>
        <input id="customerName" v-model="modelValue.name" type="text"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3"
          placeholder="ഉദാ: ശ്രീനിവാസൻ">
      </div>
      <div>
        <label for="customerPhone" class="block text-sm font-medium text-gray-700 mb-1">ഫോൺ നമ്പർ</label>
        <input id="customerPhone" v-model="modelValue.phone" type="tel"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3"
          placeholder="ഉദാ: 9xxxxxxxxx">
      </div>
      <div class="md:col-span-2">
        <label for="customerAddress" class="block text-sm font-medium text-gray-700 mb-1">വിലാസം</label>
        <textarea id="customerAddress" v-model="modelValue.address"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3"
          rows="2" placeholder="വീട്ടുപേര്, സ്ഥലം"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: {
    name: string;
    phone: string;
    address: string;
  };
}>();
</script>
<!-- <template>
  <div class="bg-white rounded-xl shadow-lg bill-card p-3 sm:p-5">
    <h2 class="text-xl sm:text-2xl font-bold text-green-700 mb-4 border-b border-green-200 pb-3">ഉപഭോക്തൃ വിവരങ്ങൾ</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="customerName" class="block text-sm font-medium text-gray-700 mb-1">പേര്</label>
        <input id="customerName" v-model="modelValue.name" type="text"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3"
          placeholder="ഉദാ: ശ്രീനിവാസൻ">
      </div>
      <div>
        <label for="customerPhone" class="block text-sm font-medium text-gray-700 mb-1">ഫോൺ നമ്പർ</label>
        <input id="customerPhone" v-model="modelValue.phone" type="tel"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3"
          placeholder="ഉദാ: 9xxxxxxxxx">
      </div>
      <div class="md:col-span-2">
        <label for="customerAddress" class="block text-sm font-medium text-gray-700 mb-1">വിലാസം</label>
        <textarea id="customerAddress" v-model="modelValue.address"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3"
          rows="2" placeholder="വീട്ടുപേര്, സ്ഥലം"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

defineEmits(['update:modelValue']);
</script> -->