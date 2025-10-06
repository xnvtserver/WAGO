// routes/transferProductsBetweenShops.js

import express from 'express';
import knex from '../db/knex.js'; // ✅ Import your configured knex instance

const router = express.Router();

/**
 * 🔄 Transfers products from one shop to another by creating entries in the `shop_products` table.
 * Products themselves are not duplicated, but reused by reference via `product_id`.
 * 
 * @param {number} fromShopId - Source shop ID
 * @param {number} toShopId - Destination shop ID
 * @param {Array<number>} selectedProductIds - Optional product IDs to transfer
 * @param {boolean} transferAll - If true, transfer all products from source
 * @returns {Object} result - success flag, message, transferred count
 */
async function transferProductsToShop({ fromShopId, toShopId, selectedProductIds = [], transferAll = false }) {
  const trx = await knex.transaction();

  try {
    // Step 1️⃣: Query all products created by `fromShopId`
    let productQuery = trx('products')
      .where('shop_id', fromShopId)
      .select(
        'id as product_id',
        'name',
        'barcode',
        'category',
        'brand',
        'unit',
        'unit_value',
        'image',
        'hsn_sac_code',
        'default_tax_category',
        'description',
        'is_active'
      );

    // 👉 If not transferring all, filter by selected IDs
    if (!transferAll && selectedProductIds.length > 0) {
      productQuery = productQuery.whereIn('id', selectedProductIds);
    }

    const parentProducts = await productQuery;

    // 🚫 If no products to transfer, abort
    if (!parentProducts.length) {
      await trx.rollback();
      return { success: false, message: 'No products to transfer' };
    }

    // Step 2️⃣: Fetch already linked products to avoid duplicates
    const existing = await trx('shop_products')
      .where('shop_id', toShopId)
      .whereIn('product_id', parentProducts.map(p => p.product_id))
      .select('product_id');

    const alreadyExists = new Set(existing.map(p => p.product_id));

    // Step 3️⃣: Prepare new entries for `shop_products`
    const entries = parentProducts
      .filter(p => !alreadyExists.has(p.product_id))
      .map(p => ({
        shop_id: toShopId,
        product_id: p.product_id,
        sku: generateSku(p.name, p.product_id, toShopId), // ⚙️ Ensure SKU is shop-specific
        barcode: generateBarcode(p.barcode, toShopId),     // ⚙️ Barcode made shop-unique
        retail_price: 0,
        wholesale_price: 0,
        purchase_price: 0,
        stock: 0,
        status: 'active',
        barcode_image: null,
        barcode_settings: JSON.stringify({}),
        reorder_threshold: 0,
        created_at: new Date(),
        updated_at: new Date()
      }));

    // Step 4️⃣: Insert into `shop_products` if there are new ones
    if (entries.length > 0) {
      await trx('shop_products').insert(entries);
    }

    await trx.commit();

    return {
      success: true,
      message: `${entries.length} product(s) transferred`,
      transferred: entries.length
    };

  } catch (error) {
    await trx.rollback();
    console.error('Product transfer error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 🔧 Generate a shop-specific SKU string
 */
function generateSku(name, productId, shopId) {
  return `${name.slice(0, 3).toUpperCase()}-${shopId}-${productId}`;
}

/**
 * 🔧 Generate a shop-specific barcode
 */
function generateBarcode(base, shopId) {
  return `${base}-${shopId}`;
}

/**
 * 🚀 POST /shops/:toShopId/transfer-products
 * Transfers products from one shop to another via payload
 * 
 * Required in body:
 *   - fromShopId: source shop ID
 *   - transferAll: boolean (true to transfer all)
 *   - selectedProductIds: array (optional if transferAll is false)
 */
router.post('/shops/:toShopId/transfer-products', async (req, res) => {
  const { toShopId } = req.params;
  const { fromShopId, transferAll, selectedProductIds } = req.body;

  if (!fromShopId) {
    return res.status(400).json({ error: 'fromShopId is required' });
  }

  try {
    const result = await transferProductsToShop({
      fromShopId: Number(fromShopId),
      toShopId: Number(toShopId),
      transferAll: Boolean(transferAll),
      selectedProductIds: selectedProductIds || [],
    });

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Transfer route error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

/* 
==========================================
✅ Example Request Usage:

➡️ URL:
POST /api/shops/7/transfer-products

➡️ Body (Transfer all):
{
  "fromShopId": 2,
  "transferAll": true
}

➡️ Body (Selective transfer):
{
  "fromShopId": 2,
  "transferAll": false,
  "selectedProductIds": [4, 7, 9]
}
==========================================
*/
