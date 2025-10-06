class ShopPermission {
    static async grantAccess(userId, shopId, permissions) {
      return db('shop_permissions').insert({
        user_id: userId,
        shop_id: shopId,
        ...permissions
      }).returning('*');
    }
  
    static async revokeAccess(userId, shopId) {
      return db('shop_permissions')
        .where({ user_id: userId, shop_id: shopId })
        .delete();
    }
  
    static async getUserPermissions(userId) {
      return db('shop_permissions')
        .where('user_id', userId)
        .select('shop_id', 'role', 'permissions');
    }
  }
  
  export default ShopPermission;