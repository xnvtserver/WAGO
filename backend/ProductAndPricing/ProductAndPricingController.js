// controllers/productPricingController.js
import db from '../config/db.js';
import { hasShopAccess  } from '../middleware/ShopAccess.js';
import { body, validationResult } from 'express-validator';
import ProductPrice from './models/ProductPriceModel.js';
import ShopPrice from './models/ShopPriceModel.js';
import fs from 'fs';

// ------------------
// Validation
// ------------------
export const validate = (method) => {
  switch (method) {
    case 'createProduct':
      return [
        body('name').notEmpty(),
        body('sku').notEmpty(),
        body('barcode').notEmpty(),
        body('category').notEmpty(),
        body('brand').notEmpty(),
        body('unit').notEmpty(),
        body('unit_value').optional().isNumeric(),
        body('retail_price').optional().isNumeric(),
        body('wholesale_price').optional().isNumeric(),
        body('purchase_price').optional().isNumeric(),
        body('stock').optional().isNumeric(),
        (req, res, next) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
          next();
        }
      ];
    default:
      return [];
  }
};

export const validateProductId = (req, res, next) => {
  const productId = req.params.productId;
  if (!/^\d+$/.test(productId)) {
    return res.status(400).json({ error: 'Invalid product ID format' });
  }
  req.validatedProductId = parseInt(productId, 10);
  next();
};

// ------------------
// Product Core
// ------------------
export const createProduct = async (req, res) => {
  try {
    const { shopId } = req.params;
    
    // Handle image upload
    const imagePath = req.file
      ? `uploads/products/${req.file.filename}`
      : null;

    // Convert numeric fields
    const numericFields = [
      'unit_value', 'retail_price', 
      'wholesale_price', 'purchase_price', 'stock'
    ];
    
    const productData = {
      name: req.body.name,
      shop_id: shopId,
      barcode: req.body.barcode,
      category: req.body.category,
      brand: req.body.brand,
      unit: req.body.unit,
      description: req.body.description,
      image: imagePath,
      is_active: req.body.is_active === 'true'
    };

    const shopProductData = {
      product_id: null, // Will be set after product creation
      shop_id: shopId,
      sku: req.body.sku,
      barcode: req.body.barcode,
      stock: req.body.stock ? parseInt(req.body.stock, 10) : 0,
      reorder_threshold : req.body.reorder_threshold ? req.body.reorder_threshold : 10
    };

    // Convert prices
    ['retail_price', 'wholesale_price', 'purchase_price'].forEach(field => {
      shopProductData[field] = req.body[field] 
        ? parseFloat(req.body[field]) 
        : null;
    });

    const product = await db.transaction(async trx => {
      // Convert unit_value
      productData.unit_value = req.body.unit_value 
        ? parseFloat(req.body.unit_value) 
        : null;

      const [insertedProduct] = await trx('products')
        .insert(productData)
        .returning('*');

      shopProductData.product_id = insertedProduct.id;
      
      await trx('shop_products').insert(shopProductData);

      return insertedProduct;
    });

    res.status(201).json(product);
  } catch (error) {
    // Clean up uploaded file if transaction fails
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }

    // Handle specific errors
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({ 
        error: 'SKU അല്ലെങ്കിൽ ബാർകോഡ് ഇതിനകം നിലവിലുണ്ട്'
      });
    }

    res.status(500).json({ 
      error: 'Product creation failed', 
      details: error.message 
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    console.log('*************** ProductAndPricingController -- getProducts ******************');
    const { shopId } = req.params;

    // Validate parameters
    if (!shopId || isNaN(shopId)) {
      return res.status(400).json({ error: 'Invalid shop ID parameter' });
    }

    // Validate shop access
    console.log(`Validating access for user ${req.user.id} to shop ${shopId}`);
    const hasAccess = await hasShopAccess(req.user.id, shopId);
    if (!hasAccess) {
      console.warn(`Access denied for user ${req.user.id} to shop ${shopId}`);
      return res.status(403).json({ error: 'Access denied' });
    }

    // Database query with error handling
    console.log(`Fetching products for shop ${shopId}`);
    const products = await db('products')
      .join('shop_products', 'products.id', 'shop_products.product_id')
      .where('shop_products.shop_id', shopId)
      .select(
        'products.*',
        'shop_products.retail_price',
        'shop_products.wholesale_price',
        'shop_products.purchase_price',
        'shop_products.stock',
        'shop_products.id as shop_product_id'  // Add alias for potential ID conflict
      );

    console.log(`Found ${products.length} products for shop ${shopId}`);
    return res.json(products);

  } catch (error) {
    console.error('Error in getProducts:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { shopId, id } = req.params;
    const hasAccess = await hasShopAccess(req.user.id, shopId);
    if (!hasAccess) return res.status(403).json({ error: 'Access denied' });

    const product = await db('products')
      .join('shop_products', 'products.id', 'shop_products.product_id')
      .where('products.id', id)
      .where('shop_products.shop_id', shopId)
      .select(
        'products.*',
        'shop_products.retail_price',
        'shop_products.wholesale_price',
        'shop_products.purchase_price',
        'shop_products.stock'
      )
      .first();

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { shopId, id } = req.params;
    const hasAccess = await hasShopAccess(req.user.id, shopId);
    if (!hasAccess) return res.status(403).json({ error: 'Access denied' });

    await db.transaction(async trx => {
      const [product] = await trx('products')
        .where({ id })
        .update(req.body)
        .returning('*');

      await trx('shop_products')
        .where({ product_id: id, shop_id: shopId })
        .update(req.body);

      res.json(product);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { shopId, id } = req.params;
    const hasAccess = await hasShopAccess(req.user.id, shopId);
    if (!hasAccess) return res.status(403).json({ error: 'Access denied' });

    await db.transaction(async trx => {
      await trx('shop_products').where({ product_id: id, shop_id: shopId }).del();
      const otherShops = await trx('shop_products').where({ product_id: id }).first();

      if (!otherShops) await trx('products').where({ id }).del();

      res.status(204).end();
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------
// Pricing Operations
// ------------------
export const getProductPricing = async (req, res) => {
  try {
    const product = await ProductPrice.getProductPricing(req.validatedProductId, req.user.shop_id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({
      ...product,
      pricing: {
        retail: product.retail_price,
        wholesale: product.wholesale_price,
        purchase: product.purchase_price
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getShopPrices = async (req, res) => {
  try {
    const prices = await ShopPrice.findShopPrices(req.params.productId);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPriceHistory = async (req, res) => {
  try {
    const history = await ProductPrice.getPriceHistory(req.params.productId, req.query.shopId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBasePrice = async (req, res) => {
  const trx = await db.transaction();
  try {
    const { productId, shopId } = req.params;
    const userId = req.user.id;
    const { retail, wholesale, purchase } = req.body;

    // Verify shop access
    // const shopAccess = await trx('shop_permissions')
    //   .where({ user_id: userId, shop_id: shopId })
    //   .first();

    // if (!shopAccess) {
    //   await trx.rollback();
    //   return res.status(403).json({ error: 'Shop access denied' });
    // }

    // Get existing prices with transaction
    const existing = await trx('shop_products')
      .where({ product_id: productId, shop_id: shopId })
      .first();

    if (!existing) {
      await trx.rollback();
      return res.status(404).json({ error: 'Product not found in shop' });
    }

    // Update prices
    const updated = await trx('shop_products')
      .where({ product_id: productId, shop_id: shopId })
      .update({
        retail_price: retail,
        wholesale_price: wholesale,
        purchase_price: purchase
      })
      .returning('*');

    // Prepare history inserts
    const historyEntries = [
      {
        product_id: productId,
        shop_id: shopId,
        price_type: 'retail',
        old_price: existing.retail_price,
        new_price: retail,
        changed_by: userId
      },
      {
        product_id: productId,
        shop_id: shopId,
        price_type: 'wholesale',
        old_price: existing.wholesale_price,
        new_price: wholesale,
        changed_by: userId
      },
      {
        product_id: productId,
        shop_id: shopId,
        price_type: 'purchase',
        old_price: existing.purchase_price,
        new_price: purchase,
        changed_by: userId
      }
    ];

    // Insert history
    await trx('price_history').insert(historyEntries);

    await trx.commit();
    res.json(updated[0]);
  } catch (error) {
    await trx.rollback();
    res.status(500).json({ 
      error: 'Price update failed',
      details: error.message
    });
  }
};

export const batchUpdatePrices = async (req, res) => {
  try {
    const result = await ShopPrice.batchUpdatePrices(req.params.productId, req.body, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
