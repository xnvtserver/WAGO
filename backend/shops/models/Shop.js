class Shop {
    static async findByOwner(ownerId) {
      return db('shops')
        .where('owner_id', ownerId)
        .select('id', 'name', 'location', 'status');
    }
  
    static async findEmployeeShops(userId) {
      return db('shop_permissions')
        .where('user_id', userId)
        .join('shops', 'shop_permissions.shop_id', 'shops.id')
        .select(
          'shops.id',
          'shops.name',
          'shops.location',
          'shop_permissions.role as shop_role'
        );
    }
  
    static async createShop(shopData) {
      return db('shops')
        .insert(shopData)
        .returning('*');
    }
  }
  
  export default Shop;