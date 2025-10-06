import express from 'express';
import {
  getShopPermissions,
  createShopPermission,
  updateShopPermission,
  deleteShopPermission
} from './shopPermissionsController.js';

const router = express.Router();

router.get('/:shopId', getShopPermissions);
router.post('/:shopId', createShopPermission);
router.put('/:shopId/:id', updateShopPermission);
router.delete('/:shopId/:id', deleteShopPermission);

export default router;