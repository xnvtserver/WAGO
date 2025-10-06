<template>
  <div class="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-medium text-gray-900">Store Details</h2>
      <p class="mt-1 text-sm text-gray-500">Update your store's basic information and contact details.</p>
    </div>
    <form class="divide-y divide-gray-200" @submit.prevent="handleSubmit">
      <div class="px-6 py-4 space-y-4">
        <div>
          <label for="store-name" class="block text-sm font-medium text-gray-700">Store Name</label>
          <input v-model="form.name" type="text" id="store-name" name="store-name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
        </div>
        <div>
          <label for="store-address" class="block text-sm font-medium text-gray-700">Address</label>
          <textarea v-model="form.address" id="store-address" name="store-address" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"></textarea>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="store-phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input v-model="form.phone" type="tel" id="store-phone" name="store-phone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
          </div>
          <div>
            <label for="store-email" class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="form.email" type="email" id="store-email" name="store-email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
          </div>
        </div>
        <div>
          <label for="store-website" class="block text-sm font-medium text-gray-700">Website</label>
          <input v-model="form.website" type="url" id="store-website" name="store-website" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
        </div>
        <div>
          <label for="store-hours" class="block text-sm font-medium text-gray-700">Business Hours</label>
          <textarea v-model="form.business_hours" id="store-hours" name="store-hours" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"></textarea>
        </div>
      </div>
      <div class="px-6 py-4 bg-gray-50 text-right">
        <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Save Changes
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settingsStore';

const settingsStore = useSettingsStore();
const form = ref({
  name: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  business_hours: ''
});

onMounted(() => {
  // Initialize the form with data from the store
  form.value = { ...settingsStore.storeInfo };
});

const handleSubmit = async () => {
  await settingsStore.updateStoreInfo(form.value);
};
</script>

<style scoped>
/* You can add scoped styles here if needed */
</style>