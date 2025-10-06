<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow rounded">
    <h2 class="text-xl font-bold mb-4">Product Transfer</h2>

    <div class="mb-4">
      <label class="block font-medium mb-1">From Shop</label>
      <select v-model="fromShopId" class="w-full p-2 border rounded">
        <option v-for="shop in shops" :key="shop.id" :value="shop.id">
          {{ shop.name }}
        </option>
      </select>
    </div>

    <div class="mb-4">
      <label class="block font-medium mb-1">To Shop</label>
      <select v-model="toShopId" class="w-full p-2 border rounded">
        <option v-for="shop in shops" :key="shop.id" :value="shop.id">
          {{ shop.name }}
        </option>
      </select>
    </div>

    <div class="mb-4">
      <label class="flex items-center">
        <input type="checkbox" v-model="transferAll" class="mr-2" />
        Transfer all products
      </label>
    </div>

    <div v-if="!transferAll" class="mb-4">
      <label class="block font-medium mb-1">Select Products</label>
      <div class="space-y-1 max-h-40 overflow-y-auto border p-2 rounded">
        <label v-for="product in availableProducts" :key="product.id" class="block">
          <input
            type="checkbox"
            :value="product.id"
            v-model="selectedProductIds"
            class="mr-2"
          />
          {{ product.name }}
        </label>
      </div>
    </div>

    <button
      @click="submitTransfer"
      :disabled="loading || !fromShopId || !toShopId"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      {{ loading ? 'Transferring...' : 'Transfer Products' }}
    </button>

    <p v-if="successMessage" class="text-green-600 mt-4">{{ successMessage }}</p>
    <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

// State
const shops = ref([])
const fromShopId = ref(null)
const toShopId = ref(null)
const availableProducts = ref([])
const selectedProductIds = ref([])
const transferAll = ref(false)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Fetch shop list on mount
onMounted(async () => {
  try {
    const res = await axios.get('/api/shops') // 🔁 Update as per your actual endpoint
    shops.value = res.data
  } catch (err) {
    console.error('Failed to load shops:', err)
    errorMessage.value = 'Failed to load shop list.'
  }
})

// Fetch products when fromShopId or transferAll changes
watch([fromShopId, transferAll], async () => {
  if (fromShopId.value && !transferAll.value) {
    try {
      const res = await axios.get(`/api/shops/${fromShopId.value}/products`) // 🔁 Update if needed
      availableProducts.value = res.data
    } catch (err) {
      errorMessage.value = 'Failed to load products from source shop.'
    }
  }
})

// Submit transfer
const submitTransfer = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await axios.post(`/api/shops/${toShopId.value}/transfer-products`, {
      fromShopId: fromShopId.value,
      transferAll: transferAll.value,
      selectedProductIds: transferAll.value ? [] : selectedProductIds.value
    })

    successMessage.value = response.data.message || 'Transfer successful!'
    selectedProductIds.value = []
    availableProducts.value = []
  } catch (error) {
    console.error('Transfer failed:', error)
    errorMessage.value =
      error.response?.data?.error || 'Product transfer failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Basic styling — update as needed */
</style>
