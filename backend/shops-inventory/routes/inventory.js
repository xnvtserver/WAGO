// routes/inventory.js
import express from 'express';
import { authenticate, authorize, verifyShopOwner } from '../../middleware/auth.js';
import {
  getShopInventory,
  createInventoryItemHandler,
  updateInventoryItemHandler,
  deleteInventoryItemHandler,
  getCategoryStock,
  updateReorderThreshold,
  getPriceHistory,
  getShopProducts,
  getProductDetails,
  updateStockLevel,
  getHighRiskProducts,
  getLowStockProducts
} from '../controller/inventoryController.js';

const router = express.Router();
console.log('******************** Inventory router called ******************');
router.get('/:shopId', authorize, getShopInventory); // Changed route pattern
router.post('/:shopId', authorize, createInventoryItemHandler);
router.put('/:shopId/:id', authorize, updateInventoryItemHandler);
router.delete('/:shopId/:id', authorize, deleteInventoryItemHandler);

//  above are tested and working routes called somewhere in the modules as on 30-05-2025

// Low stock alerts
router.get('/shops/:shopId/low-stock', getLowStockProducts);
router.get('/shops/:shopId/high-risk-products', getHighRiskProducts);

// Product management
router.get('/shops/:shopId/products', getShopProducts);
router.get('/products/:productId', getProductDetails);
router.put('/shop-products/:id/stock', updateStockLevel);
router.put('/shop-products/:id/reorder-threshold', updateReorderThreshold);

// Inventory operations
router.get('/shops/:shopId/price-history/:productId', getPriceHistory);

// Category management
router.get('/shops/:shopId/categories/:categoryId/stock', getCategoryStock);

export default router;
