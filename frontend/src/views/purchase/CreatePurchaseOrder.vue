<template>
  <form @submit.prevent="submitOrder">
    <div>
      <label>Supplier:</label>
      <select v-model="form.supplier_id" required>
        <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
          {{ supplier.name }}
        </option>
      </select>
    </div>
    
    <div>
      <label>Total Amount:</label>
      <input type="number" v-model="form.total_amount" step="0.01" required>
    </div>
    
    <button type="submit">Create Order</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from '@/axios';

const authStore = useAuthStore();
const suppliers = ref([]);
const form = ref({
  supplier_id: null,
  total_amount: 0,
  status: 'draft'
});

// Fetch suppliers for current shop
onMounted(async () => {
  try {
    const response = await axios.get('/suppliers/shop-suppliers');
    suppliers.value = response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
  }
});

const submitOrder = async () => {
  try {
    await axios.post('/purchase-orders', form.value);
    // Handle success
  } catch (error) {
    console.error('Error creating order:', error);
  }
};
</script>