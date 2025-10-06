import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const usePurchaseOrderStore = defineStore('purchaseOrder', () => {
  const suppliers = ref([])
  const shopProducts = ref([])
  const currentPurchaseOrder = ref(null)
  const loading = ref(false)

  // Fetch suppliers by shop ID
  const fetchSuppliers = async (shopId) => {
    try {
      loading.value = true
      const response = await axios.get(`/api/shops/${shopId}/suppliers`)
      suppliers.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  // Fetch shop products by shop ID
  const fetchShopProducts = async (shopId) => {
    try {
      loading.value = true
      const response = await axios.get(`/api/shops/${shopId}/shop-products`)
      shopProducts.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching shop products:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  // Create new purchase order
  const createPurchaseOrder = async (orderData) => {
    try {
      loading.value = true
      const response = await axios.post('/api/purchase-orders', orderData)
      currentPurchaseOrder.value = response.data
      return response.data
    } catch (error) {
      console.error('Error creating purchase order:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    suppliers,
    shopProducts,
    currentPurchaseOrder,
    loading,
    fetchSuppliers,
    fetchShopProducts,
    createPurchaseOrder
  }
})