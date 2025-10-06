// utils/shopAccessUtils.js
import db from '../config/db.js';

export async function hasShopAccess(userId, shopId) {
  // Check if user is owner of the shop
  const shop = await db('shops')
    .where({ id: shopId, owner_id: userId })
    .first();

  if (shop) return true;

  // Check if user is employee with permission
  const permissionRecord = await db('shop_permissions')
    .where({ user_id: userId, shop_id: shopId })
    .first();

  return permissionRecord?.permissions.includes('view_products') || false;
}
