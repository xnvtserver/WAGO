// services/inventoryService.js
import db from '../models/index.js'
import { paginate } from '../utils/paginate.js'

// ✅ GET Inventory
export const getInventory = async (shopId, filters) => {
  try {
    // Validate shop ID format
    if (!isValidObjectId(shopId)) {
      throw new Error('Invalid shop ID format');
    }

    const query = { shop: shopId, ...filters };
    
    const items = await Inventory.find(query)
      .populate('product')
      .sort({ updatedAt: -1 });

    return {
      data: items,
      meta: {
        count: items.length,
        totalStock: items.reduce((sum, item) => sum + item.stock, 0)
      }
    };
  } catch (error) {
    throw new Error(`Inventory fetch failed: ${error.message}`);
  }
};

// ✅ CREATE Inventory Item
export const createInventoryItem = async (data, shopId) => {
  const {
    name,
    category,
    sku,
    stock,
    retail_price,
    status = 'active',
    userId
  } = data

  return db.transaction(async trx => {
    // First insert into products table if product doesn't exist
    let product = await db('products')
      .where({ name, category })
      .first()
      .transacting(trx)

    if (!product) {
      const [newProduct] = await db('products')
        .insert({ name, category })
        .returning('*')
        .transacting(trx)
      product = newProduct
    }

    // Now insert into shop_products
    const [shopProduct] = await db('shop_products')
      .insert({
        product_id: product.id,
        shop_id: shopId,
        sku,
        stock,
        retail_price,
        status
      })
      .returning('*')
      .transacting(trx)

    // Record initial price in price_histories
    await db('price_histories')
      .insert({
        product_id: product.id,
        shop_id: shopId,
        price_type: 'retail',
        old_price: 0,
        new_price: retail_price,
        changed_by: userId
      })
      .transacting(trx)

    return shopProduct
  })
}

// ✅ UPDATE Inventory Item
export const updateInventoryItem = async (id, data, shopId) => {
  return db.transaction(async trx => {
    const item = await db('shop_products')
      .where({ id, shop_id: shopId })
      .first()
      .transacting(trx)

    if (!item) throw new Error('Inventory item not found')

    const priceChanged = data.retail_price !== item.retail_price

    const [updated] = await db('shop_products')
      .where({ id })
      .update(data)
      .returning('*')
      .transacting(trx)

    if (priceChanged) {
      await db('price_histories').insert({
        product_id: item.product_id,
        shop_id: shopId,
        price_type: 'retail',
        old_price: item.retail_price,
        new_price: data.retail_price,
        changed_by: data.userId
      }).transacting(trx)
    }

    return updated
  })
}

// ✅ DELETE Inventory Item
export const deleteInventoryItem = async (id, shopId) => {
  const item = await db('shop_products')
    .where({ id, shop_id: shopId })
    .first()

  if (!item) {
    throw new Error('Inventory item not found')
  }

  await db('shop_products')
    .where({ id, shop_id: shopId })
    .del()

  return item
}
