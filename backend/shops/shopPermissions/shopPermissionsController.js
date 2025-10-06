import * as shopPermissionService from './shopPermissionService.js';

export const getShopPermissions = async (req, res) => {
console.log('********getShopPermissions method called ********');
  try {
    const { shopId } = req.params;
    const permissions = await shopPermissionService.getPermissionsByShop(shopId);
    res.json({ success: true, data: permissions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createShopPermission = async (req, res) => {
  try {
    const { shopId } = req.params;
    const newPermission = await shopPermissionService.createPermission({
      ...req.body,
      shop_id: shopId
    });
    res.status(201).json({ success: true, data: newPermission });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateShopPermission = async (req, res) => {
  try {
    const { id, shopId } = req.params;
    const updated = await shopPermissionService.updatePermission(id, shopId, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteShopPermission = async (req, res) => {
  try {
    const { id, shopId } = req.params;
    await shopPermissionService.deletePermission(id, shopId);
    res.json({ success: true, message: 'Permission deleted' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};