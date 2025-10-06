import express from 'express';
import db from "../db/knex.js";
import { getRecentPurchases } from './purchaseOrdersController.js'; // Import the controller function
import { getDashboardStats } from './statsController.js'; // Import the stats controller function
const router = express.Router();


router.get('/:shopId/recent', getRecentPurchases);
router.get('/:shopId/stats', getDashboardStats);


/**
 * GET /shops/:shopId/suppliers
 * Fetch all suppliers for a given shop
 */
router.get('/shops/:shopId/suppliers', async (req, res) => {
  try {
    const suppliers = await db('suppliers')
      .select('id', 'name', 'contact_email', 'contact_phone', 'gstin', 'address')
      .where('shop_id', req.params.shopId);

    res.json(suppliers);
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    res.status(500).json({ message: 'Error retrieving suppliers' });
  }
});

/**
 * GET /shops/:shopId/shop-products
 * Fetch products for a specific shop with pricing and product info
 */
router.get('/shops/:shopId/shop-products', async (req, res) => {
  console.log(' inside GET /shops/:shopId/shop-products ');

  try {
    const products = await db('shop_products')
      .join('products', 'shop_products.product_id', 'products.id')
      .where('shop_products.shop_id', req.params.shopId)
      .select(
        'shop_products.id as shop_product_id',
        'shop_products.sku',
        'shop_products.barcode',
        'shop_products.purchase_price',
        'shop_products.wholesale_price',
        'products.id as product_id',
        'products.name as product_name',
        'products.hsn_sac_code',
        // 'products.default_tax_rate',
        'products.description'
      );
    console.log('Response :  '+products);
    res.json(products);
  } catch (err) {
    console.error('Error fetching shop products:', err);
    res.status(500).json({ message: 'Error retrieving products' });
  }
});

/**
 * POST /purchase-orders
 * Create a new purchase order and associated items
 */
router.post('/', async (req, res) => {
  const {
    shop_id,
    supplier_id,
    status,
    order_date,
    expected_date,
    total_amount,
    notes,
    items
  } = req.body;

  if (
    !shop_id ||
    !supplier_id ||
    !status ||
    !order_date ||
    !total_amount ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({ message: 'Missing or invalid purchase order data' });
  }

  const trx = await db.transaction();

  try {
    // Insert purchase order
    const [po] = await trx('purchase_orders')
      .insert({
        shop_id,
        supplier_id,
        status,
        order_date,
        expected_date: expected_date || null,
        total_amount,
        notes: notes || null
      })
      .returning('*');

    // Insert purchase order items
    const itemRecords = items.map(item => ({
      purchase_order_id: po.id,
      product_id: item.product_id,
      product_name: item.product_name,
      hsn_sac_code: item.hsn_sac_code || null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount_per_item: item.discount_per_item || 0,
      taxable_value: item.taxable_value || (item.quantity * item.unit_price - (item.discount_per_item || 0)),
      gst_rate_percentage: item.gst_rate_percentage,
      cgst_amount_per_item: item.cgst_amount_per_item || 0,
      sgst_amount_per_item: item.sgst_amount_per_item || 0,
      igst_amount_per_item: item.igst_amount_per_item || 0,
      cess_amount_per_item: item.cess_amount_per_item || 0,
      total_item_amount: item.total_item_amount
    }));

    await trx('purchase_order_items').insert(itemRecords);

    await trx.commit();

    res.status(201).json({ ...po, items: itemRecords });
  } catch (err) {
    await trx.rollback();
    console.error('Error creating purchase order:', err);
    res.status(500).json({ message: 'Failed to create purchase order' });
  }
});

/**
 * Optional: GET /purchase-orders?shop_id=xx
 * Get all purchase orders for a shop
 */
router.get('/', async (req, res) => {
  const { shop_id } = req.query;
  if (!shop_id) return res.status(400).json({ message: 'Missing shop_id query parameter' });

  try {
    const orders = await db('purchase_orders')
      .where('shop_id', shop_id)
      .orderBy('created_at', 'desc');

    res.json(orders);
  } catch (err) {
    console.error('Error fetching purchase orders:', err);
    res.status(500).json({ message: 'Failed to fetch purchase orders' });
  }
});


/**
 * GET /suppliers/shops/:shopId/suppliers/:supplierId/purchase-orders
 * Fetch all purchase orders for a given supplier in a given shop
 */
router.get('/suppliers/shops/:shopId/suppliers/:supplierId/purchase-orders', async (req, res) => {
  const { shopId, supplierId } = req.params;

try {
  const purchaseOrders = await db('purchase_orders')
    .where({
      shop_id: shopId,
      supplier_id: supplierId
    })
    .orderBy('created_at', 'desc');

  console.log('Fetched purchase orders:', purchaseOrders);

  res.json(purchaseOrders);
} catch (err) {
  console.error('Error fetching supplier purchase orders:', err);
  res.status(500).json({ message: 'Failed to fetch supplier purchase orders' });
}

});


export default router;
