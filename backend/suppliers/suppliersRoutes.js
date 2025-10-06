import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createSupplier,
  updateSupplier,
  deleteSupplier,
  listSuppliers,
  unlinkSupplierFromShop,
  listPOsByShopAndSupplier,
  createPurchaseOrder,
  listPOsByShop,
} from './suppliersController.js';
import { getTopSuppliers } from './suppliersControllergrid.js';
const router = express.Router();
router.use(authenticate); 

router.get('/shop-suppliers', async (req, res) => {
  try {
    const suppliers = await knex('suppliers')
      .where({ shop_id: req.shop.id })
      .select('id', 'name');
    res.json(suppliers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 👇 API Routes
router.get('/:shopId/topSuppliers', getTopSuppliers);


router.post('/shops/:shopId/suppliers', createSupplier);
router.put('/shops/:shopId/suppliers/:supplierId/update', updateSupplier);
router.delete('/delete/:supplierId', deleteSupplier);
router.put('/shops/:shopId/suppliers/:supplierId/unlink', unlinkSupplierFromShop);
router.get('/shops/:shopId/suppliers/:supplierId/purchase-orders',authenticate , listPOsByShopAndSupplier);
router.get('/shops/:shopId/purchase-orders',  listPOsByShop);
router.get('/shops/:shop_id/suppliers', listSuppliers);
router.post('/shops/:shopId/suppliers/:supplierId/createPurchaseOrder', createPurchaseOrder)

export default router; 
