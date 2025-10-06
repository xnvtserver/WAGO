// front-end/src/stores/productPricingStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';

export const useProductPricingStore = defineStore('productPricing', () => {
  const authStore = useAuthStore();
  
    // Reactive user reference with null checks
  const currentUser = computed(() => {
    return authStore?.user ?? null;
  });
  // State
  const products = ref([]);
  const currentProductIndex = ref(0);
  const activeTab = ref('base-price');
  const isLoading = ref(false);

  const product = ref({});
  const prices = ref({ purchase: 0, retail: 0, wholesale: 0 });
  const pricePolicy = ref('fixed');
  const bulkPricingEnabled = ref(false);
  const bulkPricingTiers = ref([]);
  const priceHistory = ref([]);
  const quickEditSidebarOpen = ref(false);
  const shops = ref([]);
  const batchUpdate = ref({ retail: '', wholesale: '' });

  const isBasePriceUpdating = ref(false);
  const isBatchPriceUpdating = ref(false);

  // Getters
  const currentProduct = computed(() => products.value[currentProductIndex.value] || product.value);

  const retailProfit = computed(() => prices.value.retail - prices.value.purchase);
  const retailProfitPercentage = computed(() =>
    ((retailProfit.value / prices.value.purchase) * 100).toFixed(2)
  );
  const wholesaleProfit = computed(() => prices.value.wholesale - prices.value.purchase);
  const wholesaleProfitPercentage = computed(() =>
    ((wholesaleProfit.value / prices.value.purchase) * 100).toFixed(2)
  );

  // ----------------------
  // Actions
  // ----------------------

  async function fetchProducts() {
    isLoading.value = true;
    try {
      const shopId = authStore.user?.shop_id; //shopid
      if (!shopId || isNaN(shopId)) throw new Error('Shop ID not available');
      console.log('****** calling await api.get(`/shops/${shopId}/products`) *****');
      const res = await api.get(`/ProductAndPricingRoutes/shops/${shopId}/products`);
      products.value = res.data;
      if (products.value.length > 0) {
        currentProductIndex.value = 0;
        await loadProductData();
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchProductPricing(productId) {
    try {
      const res = await api.get(`/ProductAndPricingRoutes/products/${productId}/pricing`);
      prices.value = res.data.pricing ?? res.data;
    } catch (err) {
      console.error('Failed to load pricing:', err);
      throw err;
    }
  }

  async function fetchShopPrices(productId) {
    try {
      const res = await api.get(`/ProductAndPricingRoutes/products/${productId}/shop-prices`);
      shops.value = res.data;
    } catch (err) {
      console.error('Failed to load shop prices:', err);
      throw err;
    }
  }

  async function fetchPriceHistory(productId) {
    try {
      const res = await api.get(`/ProductAndPricingRoutes/products/${productId}/price-history`);
      priceHistory.value = res.data;
    } catch (err) {
      console.error('Failed to load price history:', err);
      throw err;
    }
  }

  async function loadProductData() {
    try {
      const productId = currentProduct.value?.id;
      if (!productId || isNaN(productId)) throw new Error('Invalid product selection');

      await Promise.all([
        fetchProductPricing(productId),
        fetchShopPrices(productId),
        fetchPriceHistory(productId)
      ]);

      resetBulkPricing();
      resetBatchUpdate();
    } catch (err) {
      console.error('Error loading product data:', err);
      throw err;
    }
  }

  async function updateBasePrices(priceData) {
    this.isBasePriceUpdating = true;
  try {
      // Validate authentication state
      if (!currentUser.value?.shop_id) {
        throw new Error('User not authenticated or missing shop ID');
      }
      const productId = this.currentProduct?.id;
      const shopId = currentUser.value.shop_id;

      if (!productId || isNaN(productId)) {
        throw new Error('Invalid product selection');
      }
      const oldPrices = { ...this.prices };
      const res = await api.put(`/ProductAndPricingRoutes/shops/${shopId}/products/${productId}/prices`, priceData);
      this.prices = res.data;
      this.logPriceChange('base', oldPrices, this.prices);
      
      return res.data;
  }catch (err) {
      console.error('Price update failed:', err);
      throw err;
    } finally {
    this.isBasePriceUpdating = false;
  }
  }

  async function updateBatchPrices() {
    isBatchPriceUpdating.value = true;
    try {
      const productId = currentProduct.value?.id;
      if (!productId || isNaN(productId)) throw new Error('Invalid product ID');

      const res = await api.post(`/ProductAndPricingRoutes/products/${productId}/batch-update`, batchUpdate.value);

      shops.value = shops.value.map(shop => ({
        ...shop,
        retailPrice: batchUpdate.value.retail || shop.retailPrice,
        wholesalePrice: batchUpdate.value.wholesale || shop.wholesalePrice
      }));

      logPriceChange('batch', null, res.data);
      resetBatchUpdate();
    } catch (err) {
      console.error('Batch price update failed:', err);
      throw err;
    } finally {
      isBatchPriceUpdating.value = false;
    }
  }

  // ----------------------
  // Utility
  // ----------------------

  function nextProduct() {
    if (currentProductIndex.value < products.value.length - 1) {
      currentProductIndex.value++;
      loadProductData();
    }
  }

  function previousProduct() {
    if (currentProductIndex.value > 0) {
      currentProductIndex.value--;
      loadProductData();
    }
  }

  function setActiveTab(tab) {
    activeTab.value = tab;
  }

  function toggleBulkPricing() {
    bulkPricingEnabled.value = !bulkPricingEnabled.value;
    if (!bulkPricingEnabled.value) resetBulkPricing();
  }

  function addBulkPricingTier() {
    bulkPricingTiers.value.push({
      min: 1,
      max: 10,
      retail: prices.value.retail,
      wholesale: prices.value.wholesale
    });
  }

  function removeBulkPricingTier(index) {
    if (bulkPricingTiers.value.length > 1) {
      bulkPricingTiers.value.splice(index, 1);
    }
  }

  function toggleQuickEditSidebar() {
    quickEditSidebarOpen.value = !quickEditSidebarOpen.value;
  }

  function logPriceChange(type, oldPrices, newPrices) {
    const entry = {
      date: new Date().toLocaleString(),
      type,
      oldPrice: oldPrices?.retail || 0,
      newPrice: newPrices.retail,
      change: `₹${(newPrices.retail - (oldPrices?.retail || 0)).toFixed(2)}`,
      user: authStore.user?.name || 'Admin'
    };
    priceHistory.value.unshift(entry);
  }

  function resetBulkPricing() {
    bulkPricingTiers.value = [
      { min: 1, max: 10, retail: prices.value.retail, wholesale: prices.value.wholesale }
    ];
  }

  function resetBatchUpdate() {
    batchUpdate.value = { retail: '', wholesale: '' };
  }

  return {
    // State
    currentUser,
    products,
    currentProductIndex,
    activeTab,
    isLoading,
    product,
    prices,
    pricePolicy,
    shops,
    bulkPricingEnabled,
    bulkPricingTiers,
    priceHistory,
    quickEditSidebarOpen,
    batchUpdate,
    isBasePriceUpdating,
    isBatchPriceUpdating,

    // Getters
    currentProduct,
    retailProfit,
    retailProfitPercentage,
    wholesaleProfit,
    wholesaleProfitPercentage,

    // Actions
    fetchProducts,
    fetchProductPricing,
    fetchShopPrices,
    fetchPriceHistory,
    loadProductData,
    nextProduct,
    previousProduct,
    setActiveTab,
    toggleBulkPricing,
    addBulkPricingTier,
    removeBulkPricingTier,
    toggleQuickEditSidebar,
    updateBatchPrices,
    updateBasePrices,
    logPriceChange,
    resetBulkPricing,
    resetBatchUpdate
  };
});


// Operation	: Updated API Path
// Get all products	/shops/:shopId/products
// Get base prices	/products/:productId/pricing
// Get shop prices	/products/:productId/shop-prices
// Get price history	/products/:productId/price-history
// Update base prices	/products/:productId/base-prices
// Batch update shop prices	/products/:productId/batch-update