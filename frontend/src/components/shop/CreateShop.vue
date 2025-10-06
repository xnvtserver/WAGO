<!-- frontend/src/views/CreateShop.vue -->
<template>
  <div class="max-w-md mx-auto mt-8">
    <form @submit.prevent="createShop" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Shop Name</label>
        <input v-model="form.name" required class="form-input" />
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Location</label>
        <input v-model="form.location" required class="form-input" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Contact Number</label>
        <input v-model="form.contact_number" required class="form-input" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Address</label>
        <textarea v-model="form.address" required class="form-input" />
      </div>

      <button type="submit" class="btn-primary" :disabled="isLoading">
        {{ isLoading ? 'Creating...' : 'Create Shop' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import api from '@/api';

const authStore = useAuthStore();
const router = useRouter();
const isLoading = ref(false);

const form = ref({
  name: '',
  location: '',
  contact_number: '',
  address: ''
});

const createShop = async () => {
  try {
    isLoading.value = true;
    const { data } = await api.post('/shops', form.value);
    
    // Update auth store
    authStore.user.shops = [...authStore.user.shops, data];
    authStore.user.role = 'owner';
    
    router.push('/dashboard');
  } catch (error) {
    console.error('Shop creation failed:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>