// models/ProductPrice.js
import db from '../../config/db.js';

const ProductPrice = {
  async getAllProducts() {
    return db('products').select('*');
},


async getProductPricing(productId, shopId) {
  return db('products')
    .select(
      'products.*',
      'shop_products.retail_price',
      'shop_products.wholesale_price',
      'shop_products.purchase_price',
      'shop_products.stock'
    )
    .leftJoin('shop_products', function() {
      this.on('products.id', '=', 'shop_products.product_id')
        .andOnVal('shop_products.shop_id', '=', parseInt(shopId, 10))
    })
    .where('products.id', parseInt(productId, 10))
    .first();
},

async getProductById(id) {
    return db('products').where({ id }).first();
},

async getAllProducts() {
  return db('products').select('*');
},

async getProductById(id) {
  return db('products').where({ id }).first();
},

async getPriceHistory(productId) {
  return db('price_history')
    .where('product_id', productId)
    .orderBy('created_at', 'desc');
},

async getPriceHistory(productId, shopId = null) {
    const query = db('price_history')
        .where('product_id', productId)
        .orderBy('created_at', 'desc');
    if (shopId) {
        query.where('shop_id', shopId);
    } else {
        query.whereNull('shop_id'); // Only global price changes if no shopId
    }
    return query;
},
  async findProductPricing(productId) {
    return db('products')
      .where('products.id', productId)
      .join('product_prices', 'products.id', 'product_prices.product_id')
      .first();
  },

  async updateBasePrice(productId, priceData, userId) {
    return db.transaction(async trx => {
      // Get old prices
      const oldPrices = await trx('product_prices')
        .where('product_id', productId)
        .first();

      // Update prices
      const updated = await trx('product_prices')
        .where('product_id', productId)
        .update(priceData)
        .returning('*');

      // Log price history
      await trx('price_history').insert({
        product_id: productId,
        price_type: 'retail',
        old_price: oldPrices.retail_price,
        new_price: priceData.retail_price,
        changed_by: userId
      });

      return updated;
    });
  },

};

export default ProductPrice;