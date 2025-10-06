//Backend/inventory/controller/inventoryController.js
import { getInventory, updateInventoryItem, createInventoryItem, deleteInventoryItem } from '../service/inventoryService.js';

// GET - Fetch Inventory
// Enhance Filter Handling in Backend:
export const getShopInventory = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    const shopId = req.params.shopId;
    
    const query = { 
      shop: shopId,
      ...(status && { status }),
      ...(category && { category })
    };

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { sku: new RegExp(search, 'i') },
        { barcode: new RegExp(search, 'i') }
      ];
    }

    const inventory = await Inventory.find(query)
      .sort({ updatedAt: -1 })
      .populate('product');

    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST - Create a new inventory item
export const createInventoryItemHandler = async (req, res) => {
  const data = req.body;
  const shopId = req.user.shop_id;

  try {
    const newItem = await createInventoryItem(data, shopId);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT - Update an inventory item
export const updateInventoryItemHandler = async (req, res) => {
  try {
    const { shopId, id } = req.params;
    const updates = req.body;

    // 1. Validate inputs
    if (!shopId || !id) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // 2. Authorization check
    const permission = await db('shop_permissions')
      .where({
        user_id: req.user.id,
        shop_id: shopId
      })
      .whereRaw('permissions @> ARRAY[?]::permission_type[]', ['manage_inventory']).first();

    if (!permission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // 3. Perform update
    const updatedItem = await db('shop_products')
      .where({ id, shop_id: shopId })
      .update({
        retail_price: updates.price,
        stock: updates.stock,
        updated_at: db.fn.now()
      })
      .returning('*');

    if (!updatedItem.length) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ success: true, data: updatedItem[0] });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE - Delete an inventory item
export const deleteInventoryItemHandler = async (req, res) => {
  const { id } = req.params;
  const shopId = req.user.shop_id;

  try {
    const deletedItem = await deleteInventoryItem(id, shopId);
    res.json({ success: true, data: deletedItem });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};


  // Get low stock products for a specific shop
  export const getLowStockProducts = async (req, res) => {
    try {
      const { shopId } = req.params;
      const lowStockProducts = await db('shop_products')
        .join('products', 'shop_products.product_id', 'products.id')
        .select(
          'shop_products.id',
          'products.name',
          'products.barcode',
          'shop_products.stock',
          'shop_products.reorder_threshold',
          'products.category',
          'products.unit'
        )
        .where('shop_products.shop_id', shopId)
        .whereRaw('shop_products.stock < shop_products.reorder_threshold');

      res.json(lowStockProducts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch low stock products' });
    }
  };

  // Get high-risk products (low stock + high sales category)
  export const getHighRiskProducts = async (req, res) => {
    try {
      const { shopId } = req.params;
      
      // Step 1: Find high-sales categories in the last 30 days
      const highSalesCategories = await db('order_items')
        .join('products', 'order_items.product_id', 'products.id')
        .select('products.category')
        .sum('order_items.quantity as total_sold')
        .where('order_items.shop_id', shopId)
        .where('order_items.created_at', '>=', db.raw('NOW() - INTERVAL \'30 days\''))
        .groupBy('products.category')
        .orderBy('total_sold', 'desc')
        .limit(3)
        .pluck('category');

      // Step 2: Get low stock products in these categories
      const highRiskProducts = await db('shop_products')
        .join('products', 'shop_products.product_id', 'products.id')
        .select(
          'shop_products.id',
          'products.name',
          'products.barcode',
          'shop_products.stock',
          'shop_products.reorder_threshold',
          'products.category'
        )
        .where('shop_products.shop_id', shopId)
        .whereIn('products.category', highSalesCategories)
        .whereRaw('shop_products.stock < shop_products.reorder_threshold');

      res.json(highRiskProducts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch high-risk products' });
    }
  };

  // Update stock level
  export const updateStockLevel = async (req, res) => {
    try {
      const { id } = req.params;
      const { adjustment, newStock } = req.body;
      
      if (typeof adjustment === 'number') {
        await db('shop_products')
          .where({ id })
          .increment('stock', adjustment);
      } else if (typeof newStock === 'number') {
        await db('shop_products')
          .where({ id })
          .update({ stock: newStock });
      } else {
        return res.status(400).json({ error: 'Invalid stock update request' });
      }

      // Log the adjustment
      await db('inventory_adjustments').insert({
        shop_product_id: id,
        adjustment: adjustment || newStock - currentStock,
        reason: req.body.reason || 'Manual adjustment',
        adjusted_by: req.user.id
      });

      res.json({ message: 'Stock updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update stock' });
    }
  };

  // Get product details with shop-specific info
  export const getProductDetails = async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await db('products')
        .leftJoin('price_history', 'products.id', 'price_history.product_id')
        .select(
          'products.*',
          db.raw('JSONB_AGG(price_history.*) as price_history')
        )
        .where('products.id', productId)
        .groupBy('products.id')
        .first();

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product details' });
    }
  };

  // Get all products in a shop
  export const getShopProducts = async (req, res) => {
    try {
      const { shopId } = req.params;
      const { lowStock } = req.query;
      
      let query = db('shop_products')
        .join('products', 'shop_products.product_id', 'products.id')
        .select(
          'shop_products.*',
          'products.name',
          'products.category',
          'products.brand'
        )
        .where('shop_products.shop_id', shopId);

      if (lowStock === 'true') {
        query = query.whereRaw('shop_products.stock < shop_products.reorder_threshold');
      }

      const products = await query;
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch shop products' });
    }
  };

  // Get price history for a product in a shop
  export const getPriceHistory = async (req, res) => {
    try {
      const { shopId, productId } = req.params;
      const history = await db('price_history')
        .where({ product_id: productId })
        .andWhere(qb => 
          qb.where({ shop_id: shopId }).orWhereNull('shop_id')
        )
        .orderBy('created_at', 'desc');

      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch price history' });
    }
  };

  // Update reorder threshold
  export const updateReorderThreshold = async (req, res) => {
    try {
      const { id } = req.params;
      const { threshold } = req.body;
      
      if (typeof threshold !== 'number' || threshold < 0) {
        return res.status(400).json({ error: 'Invalid threshold value' });
      }

      await db('shop_products')
        .where({ id })
        .update({ reorder_threshold: threshold });

      res.json({ message: 'Reorder threshold updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update threshold' });
    }
  };

  // Get category stock summary
  export const getCategoryStock = async (req, res) => {
    try {
      const { shopId, categoryId } = req.params;
      
      const categorySummary = await db('shop_products')
        .join('products', 'shop_products.product_id', 'products.id')
        .select(
          'products.category',
          db.raw('SUM(shop_products.stock) as total_stock'),
          db.raw('COUNT(*) as product_count'),
          db.raw('SUM(CASE WHEN shop_products.stock < shop_products.reorder_threshold THEN 1 ELSE 0 END) as low_stock_count')
        )
        .where('shop_products.shop_id', shopId)
        .where('products.category', categoryId)
        .groupBy('products.category')
        .first();

      res.json(categorySummary || {});
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch category stock' });
    }
  };

