// routes/productPricingRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  validate,
  getProductPricing,
  getShopPrices,
  getPriceHistory,
  updateBasePrice,
  batchUpdatePrices,
  validateProductId
} from './ProductAndPricingController.js';

import { authenticate, authorize, verifyShopOwner } from '../middleware/auth.js';
import { wrapHandler } from './util/routerWrapper.js';

const router = express.Router();

// ✅ Now it's safe to use __dirname
const uploadDir = path.resolve(__dirname, '../public/uploads/products');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });


// Authentication
router.use(authenticate);

// ----------------------
// Core Product Routes
// ----------------------
router.get('/shops/:shopId/products', getProducts);
router.get('/shops/:shopId/products/:id', getProductById);
router.post('/shops/:shopId/products', upload.single('image'), verifyShopOwner, createProduct);
router.put('/shops/:shopId/products/:id', authorize, updateProduct);
router.delete('/shops/:shopId/products/:id', authorize, deleteProduct);
router.put('/shops/:shopId/products/:productId/prices',validateProductId,wrapHandler(updateBasePrice));

// ----------------------
// Pricing Routes
// ----------------------
router.get('/products/:productId/pricing', validateProductId, wrapHandler(getProductPricing));
//usage in /product-price , shop prices
router.get('/products/:productId/shop-prices', validateProductId, wrapHandler(getShopPrices));
router.get('/products/:productId/price-history', validateProductId, wrapHandler(getPriceHistory));
router.put('/products/:productId/base-prices', validateProductId, wrapHandler(updateBasePrice));
router.post('/products/:productId/batch-update', validateProductId, wrapHandler(batchUpdatePrices));

// ----------------------
// Legacy/Fallback Routes
// ----------------------
router.post('/products', upload.single('image'), verifyShopOwner, createProduct);
router.get('/products', wrapHandler(getProducts));
router.get('/products/:productId', validateProductId, wrapHandler(getProductById));


// ## ✅ 1. **List Shops API (filtered by parent\_shop\_id)**
// GET /api/shops
router.get('/shops', async (req, res) => {
  const userId = req.user.id; // assuming user is authenticated and req.user is populated

  try {
    const parentShopId = await db('shops')
      .select('id')
      .where({ owner_id: userId })
      .first();

    if (!parentShopId) return res.status(404).json({ error: 'User has no parent shop' });

    const shops = await db('shops')
      .where({ parent_shop_id: parentShopId.id })
      .select('id', 'name', 'location', 'status');

    // Optionally fetch shop prices for current product from shop_products
    const productId = req.query.productId;
    if (productId) {
      const prices = await db('shop_products')
        .whereIn('shop_id', shops.map(s => s.id))
        .andWhere('product_id', productId);

      const enriched = shops.map(shop => {
        const priceEntry = prices.find(p => p.shop_id === shop.id) || {};
        return {
          ...shop,
          retailPrice: priceEntry.retail_price || null,
          wholesalePrice: priceEntry.wholesale_price || null,
          lastUpdated: priceEntry.updated_at || null
        };
      });

      return res.json(enriched);
    }

    return res.json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// ## ✅ 2. **Update Shop Price for One Shop and Product**
// PUT /api/pricing/products/:productId/shop-price
router.put('/pricing/products/:productId/shop-price', async (req, res) => {
  const { productId } = req.params;
  const { shopId, retail_price, wholesale_price } = req.body;

  if (!shopId || !retail_price || !wholesale_price) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const existing = await db('shop_products')
      .where({ product_id: productId, shop_id: shopId })
      .first();

    if (existing) {
      await db('shop_products')
        .where({ product_id: productId, shop_id: shopId })
        .update({
          retail_price,
          wholesale_price,
          updated_at: new Date()
        });
    } else {
      // fallback: insert default purchase_price, stock, etc.
      await db('shop_products').insert({
        product_id: productId,
        shop_id: shopId,
        retail_price,
        wholesale_price,
        purchase_price: 0,
        stock: 0,
        sku: `${productId}-${shopId}`,
        barcode: `${productId}-${shopId}`,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to update shop price:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// ## ✅ 3. **Batch Update Prices for All Shops**
// PUT /api/pricing/products/:productId/shop-prices/batch
router.put('/pricing/products/:productId/shop-prices/batch', async (req, res) => {
  const { productId } = req.params;
  const { retail, wholesale } = req.body;
  const userId = req.user.id;

  if (!retail || !wholesale) {
    return res.status(400).json({ error: 'Retail and wholesale price are required' });
  }

  try {
    const parentShop = await db('shops')
      .select('id')
      .where({ owner_id: userId })
      .first();

    const shops = await db('shops')
      .where({ parent_shop_id: parentShop.id })
      .select('id');

    const shopIds = shops.map(s => s.id);

    for (const shopId of shopIds) {
      const exists = await db('shop_products')
        .where({ shop_id: shopId, product_id: productId })
        .first();

      if (exists) {
        await db('shop_products')
          .where({ shop_id: shopId, product_id: productId })
          .update({
            retail_price: retail,
            wholesale_price: wholesale,
            updated_at: new Date()
          });
      } else {
        await db('shop_products').insert({
          product_id: productId,
          shop_id: shopId,
          retail_price: retail,
          wholesale_price: wholesale,
          purchase_price: 0,
          stock: 0,
          sku: `${productId}-${shopId}`,
          barcode: `${productId}-${shopId}`,
          status: 'active',
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Batch update failed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// ## 🧩 Optional: Get All Shop Products for a Product
// GET /api/products/:productId/shop-prices
// router.get('/products/:productId/shop-prices', async (req, res) => {
//   const { productId } = req.params;
//   const userId = req.user.id;

//   try {
//     const parentShop = await db('shops')
//       .select('id')
//       .where({ owner_id: userId })
//       .first();

//     const shops = await db('shops')
//       .where({ parent_shop_id: parentShop.id });

//     const prices = await db('shop_products')
//       .whereIn('shop_id', shops.map(s => s.id))
//       .andWhere('product_id', productId);

//     const result = shops.map(shop => {
//       const price = prices.find(p => p.shop_id === shop.id) || {};
//       return {
//         ...shop,
//         retailPrice: price.retail_price || null,
//         wholesalePrice: price.wholesale_price || null,
//         lastUpdated: price.updated_at || null
//       };
//     });

//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

export default router;
