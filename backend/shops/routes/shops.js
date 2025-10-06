// routes/shops.js
import express from 'express'
import db from '../../config/db.js'
import { getShopProducts, createShop , updateInventoryItemHandler} from '../controller/shopController.js';
import { addSupplierForShop , listSuppliersForShop , getSupplierDetailsForShop , updateSupplierFromShop , deleteSupplierFromShop , listPurchaseOrdersForSupplierByShop} from '../controller/shopSupplierController.js';
import {getShopProductPriceHistory, removeProductFromShop , listShopProducts, updateShopProductStock, updateShopProductDetails, getShopProductDetails, assignProductToShop} from '../controller/shopProductController.js';
import {listShopPurchaseOrders, receiveShopPurchaseOrderItems , addItemsToShopPurchaseOrder, updateShopPurchaseOrderStatus, getShopPurchaseOrderDetails, createShopPurchaseOrder,updateShopPurchaseOrder} from '../controller/shopPurchaseController.js';
import {getLowStockProducts , getshoppromo} from '../controller/LowStockShopProducts.js';
import { authenticate, authorize, verifyShopOwner } from '../../middleware/auth.js';
const router = express.Router()

router.post('/shops/create', authenticate , createShop);
router.get('/shop-products/:shopId', getShopProducts);
// Updating inventory table product entry details (PUT method)
router.put('/shop-products/:id', async (req, res) => {
  const productId = req.params.id;
  const { price, stock } = req.body;

  if (price == null || stock == null) {
    return res.status(400).json({ error: 'Price and stock are required' });
  }

  try {
    const updated = await db('shop_products')
      .where('id', productId)
      .update({
        retail_price: price,
        stock,
        updated_at: new Date()
      })
      .returning('*');

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});
// updating inventory items
router.put('/shop-products/:shopId/:id', authenticate, updateInventoryItemHandler);
//  above are tested and working routes called somewhere in the modules as on 30-05-2025

// Supplier Management
router.post('/shops/:shopId/suppliers', addSupplierForShop);
router.get('/shops/:shopId/suppliers', listSuppliersForShop);
router.get('/shops/:shopId/suppliers/:supplierId', getSupplierDetailsForShop);
router.put('/shops/:shopId/suppliers/:supplierId', updateSupplierFromShop);
router.delete('/shops/:shopId/suppliers/:supplierId', deleteSupplierFromShop);
router.get('/shops/:shopId/suppliers/:supplierId/purchase-orders', listPurchaseOrdersForSupplierByShop);

// Product Management
router.post('/shops/:shopId/products', assignProductToShop);
router.get('/shops/:shopId/products/:shopProductId', getShopProductDetails);
router.put('/shops/:shopId/products/:shopProductId', updateShopProductDetails);
router.put('/shops/:shopId/products/:shopProductId/stock', updateShopProductStock);
router.get('/shops/:shopId/products', listShopProducts);
router.delete('/shops/:shopId/products/:shopProductId', removeProductFromShop);
router.get('/shops/:shopId/products/:shopProductId/price-history', getShopProductPriceHistory);

// Purchase Orders
router.post('/shops/:shopId/purchase-orders', createShopPurchaseOrder);
router.get('/shops/:shopId/purchase-orders/:poId', getShopPurchaseOrderDetails);
router.put('/shops/:shopId/purchase-orders/:poId/status', updateShopPurchaseOrderStatus);
router.post('/shops/:shopId/purchase-orders/:poId/items', addItemsToShopPurchaseOrder);
router.post('/shops/:shopId/purchase-orders/:poId/receive', receiveShopPurchaseOrderItems);
router.get('/shops/:shopId/purchase-orders', listShopPurchaseOrders);
router.put('/shops/:shopId/purchase-orders/:poId', updateShopPurchaseOrder);



// low stock shop_products
// GET low stock products
router.get('/low-stock-product-of-our-shop', authenticate, getLowStockProducts);

// GET shop products inventory
router.get('/:id', getshoppromo);

export default router
