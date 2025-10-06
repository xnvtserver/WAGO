<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
    <div class="w-full max-w-2xl">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">

        <!-- Header -->
        <div class="bg-indigo-600 py-5 px-6 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white">Create New Shop</h1>
            <p class="text-indigo-100 mt-1">Fill in the details to register your shop</p>
          </div>
          <div class="bg-white bg-opacity-20 p-3 rounded-full">
            <i class="fas fa-store text-white text-xl"></i>
          </div>
        </div>

        <!-- Main Form -->
        <div class="p-6">
          <transition name="fade">
            <div v-if="success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center">
                <i class="fas fa-check-circle text-green-500 text-xl"></i>
                <div class="ml-3">
                  <h3 class="text-green-800 font-medium">Shop created successfully!</h3>
                  <p class="text-green-700 mt-2">Your shop "{{ shop.name }}" has been registered.</p>
                  <p class="text-green-700">A confirmation email has been sent to {{ shop.email }}.</p>
                </div>
              </div>
            </div>
          </transition>

          <transition name="fade">
            <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center">
                <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                <div class="ml-3">
                  <h3 class="text-red-800 font-medium">Something went wrong</h3>
                  <p class="text-red-700 mt-2">{{ error }}</p>
                </div>
              </div>
            </div>
          </transition>

          <!-- FORM -->
          <form v-if="!success" @submit.prevent="submitForm" class="space-y-6">
            <!-- Shop Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Shop Name *</label>
              <input type="text" id="name" v-model="shop.name" placeholder="Awesome Shop"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
            </div>

            <!-- Location -->
            <div>
              <label for="location" class="block text-sm font-medium text-gray-700">Location *</label>
              <input type="text" id="location" v-model="shop.location" placeholder="123 Main St, City"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              <p v-if="errors.location" class="text-red-600 text-sm mt-1">{{ errors.location }}</p>
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number *</label>
              <input type="text" id="phone" v-model="shop.phone" placeholder="+1234567890"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              <p v-if="errors.phone" class="text-red-600 text-sm mt-1">{{ errors.phone }}</p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email *</label>
              <input type="email" id="email" v-model="shop.email" placeholder="shop@example.com"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
            </div>

            <div class="pt-4 flex justify-end space-x-4">
              <button type="button" @click="resetForm"
                class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                Reset
              </button>
              <button type="submit" :disabled="loading"
                class="px-6 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center">
                <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                {{ loading ? 'Creating...' : 'Create Shop' }}
              </button>
            </div>
          </form>

          <div v-if="success" class="mt-6 flex justify-between">
            <button @click="resetForm"
              class="px-4 py-2 border border-gray-300 text-sm rounded-lg bg-white hover:bg-gray-50">
              Create Another Shop
            </button>
            <button @click="goToDashboard"
              class="px-6 py-2 text-sm rounded-lg text-white bg-indigo-600 hover:bg-indigo-700">
              View Your Shops
            </button>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

export default {
  name: 'CreateShopForm',
  data() {
    return {
      shop: { name: '', location: '', phone: '', email: '', parent_shop_id: null },
      errors: {},
      loading: false,
      success: false,
      error: ''
    };
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.errors = {};

      if (!this.shop.name.trim()) {
        this.errors.name = 'Shop name is required';
        isValid = false;
      }
      if (!this.shop.location.trim()) {
        this.errors.location = 'Location is required';
        isValid = false;
      }
      if (!this.shop.phone.trim()) {
        this.errors.phone = 'Phone number is required';
        isValid = false;
      } else if (!/^\+?[\d\s\-()]+$/.test(this.shop.phone)) {
        this.errors.phone = 'Please enter a valid phone number';
        isValid = false;
      }
      if (!this.shop.email.trim()) {
        this.errors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.shop.email)) {
        this.errors.email = 'Please enter a valid email address';
        isValid = false;
      }

      return isValid;
    },

    async submitForm() {
      const auth = useAuthStore();
      this.shop.parent_shop_id = auth.activeShop;
      const token = auth.token;

      if (!this.validateForm()) return;

      this.loading = true;
      this.error = '';

      try {
        const response = await fetch('/api/inv/shops/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.shop)
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Unknown error');

        this.success = true;
      } catch (err) {
        console.error('Submit Error:', err);
        this.error = err.message || 'Failed to create shop.';
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.shop = { name: '', location: '', phone: '', email: '', parent_shop_id: null };
      this.errors = {};
      this.success = false;
      this.error = '';
    },

    goToDashboard() {
      this.$router.push('/dashboard');
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
