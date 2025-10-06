import db from '../../config/db.js';

export const getPermissionsByShop = async (shopId) => {
  return db('shop_permissions')
    .where({ shop_id: shopId })
    .select('*');
};

export const createPermission = async (data) => {
  return db('shop_permissions')
    .insert(data)
    .returning('*');
};

export const updatePermission = async (id, shopId, updates) => {
  return db('shop_permissions')
    .where({ id, shop_id: shopId })
    .update(updates)
    .returning('*');
};

export const deletePermission = async (id, shopId) => {
  return db('shop_permissions')
    .where({ id, shop_id: shopId })
    .delete();
};