<!-- components/settings/modals/AddTaxModal.vue -->
<template>
  <div v-if="show" class="fixed z-50 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Add Tax Rate</h3>
          
          <div class="mt-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Tax Name</label>
              <input 
                v-model="form.name"
                type="text" 
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="e.g. State Sales Tax"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Rate (%)</label>
              <input
                v-model.number="form.rate"
                type="number"
                step="0.01"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="e.g. 6.25"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Tax Type</label>
              <select 
                v-model="form.type"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              >
                <option value="sales">Sales Tax</option>
                <option value="local">Local Tax</option>
                <option value="vat">VAT</option>
                <option value="gst">GST</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Region</label>
              <input
                v-model="form.region"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="e.g. California"
              >
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            @click="saveTaxRate"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Add Tax Rate
          </button>
          <button 
            type="button" 
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useSettingsStore } from '@/stores/settingsStore';

const props = defineProps(['show']);
const emit = defineEmits(['close', 'tax-added']);

const settingsStore = useSettingsStore();
const form = ref({
  name: '',
  rate: null,
  type: 'sales',
  region: ''
});

const saveTaxRate = async () => {
  try {
    await settingsStore.addTaxRate(form.value);
    emit('tax-added');
    emit('close');
    resetForm();
  } catch (error) {
    console.error('Error adding tax rate:', error);
  }
};

const resetForm = () => {
  form.value = {
    name: '',
    rate: null,
    type: 'sales',
    region: ''
  };
};
</script>