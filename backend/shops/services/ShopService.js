export default {
    async getShopDetails(shopId) {
      const response = await apiFetch(`/shops/${shopId}`);
      return response;
    },
    // Add other shop-related methods
  };