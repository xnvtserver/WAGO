// models/ShopPriceModel.js
import db from '../../config/db.js';

const ShopPrice = {
  async findShopPrices(productId) {
    const numericProductId = parseInt(productId, 10);

    return db('shop_products')
      .where('product_id', numericProductId)
      .join('shops', 'shop_products.shop_id', 'shops.id')
      .select(
        'shops.id',
        'shops.name',
        'shop_products.retail_price',
        'shop_products.wholesale_price',
        'shop_products.status'
      );
  },

async getShopPrice(shopId, productId) {
  const result = await db('shop_products')
    .where({
      shop_id: parseInt(shopId, 10),
      product_id: parseInt(productId, 10)
    })
    .first();

  if (!result) {
    throw new Error('PRODUCT_NOT_LINKED_TO_SHOP');
  }
  return result;
},

  async updateShopPrice(shopId, productId, priceData, userId) {
    const numericShopId = parseInt(shopId, 10);
    const numericProductId = parseInt(productId, 10);

    return db.transaction(async trx => {
      const oldPrices = await trx('shop_products')
        .where({ shop_id: numericShopId, product_id: numericProductId })
        .first();

      const updated = await trx('shop_products')
        .where({ shop_id: numericShopId, product_id: numericProductId })
        .update({
          retail_price: priceData.retail_price,
          wholesale_price: priceData.wholesale_price,
          purchase_price: priceData.purchase_price,
          stock: priceData.stock, // Optional, only if included
          updated_at: trx.fn.now()
        })
        .returning('*');

      if (oldPrices) {
        for (const priceType of ['retail', 'wholesale', 'purchase']) {
          const field = `${priceType}_price`;
          if (
            priceData[field] !== undefined &&
            oldPrices[field] !== priceData[field]
          ) {
            await trx('price_history').insert({
              product_id: numericProductId,
              shop_id: numericShopId,
              price_type: priceType,
              old_price: oldPrices[field],
              new_price: priceData[field],
              changed_by: userId
            });
          }
        }
      } else if (updated && updated.length > 0) {
        for (const priceType of ['retail', 'wholesale', 'purchase']) {
          const field = `${priceType}_price`;
          if (updated[0][field] !== null) {
            await trx('price_history').insert({
              product_id: numericProductId,
              shop_id: numericShopId,
              price_type: priceType,
              old_price: null,
              new_price: updated[0][field],
              changed_by: userId
            });
          }
        }
      }

      return updated;
    });
  },

  async batchUpdatePrices(productId, priceData, userId) {
    const numericProductId = parseInt(productId, 10);

    return db.transaction(async trx => {
      const shops = await trx('shops')
        .where('status', 'active')
        .select('id');

      const updates = shops.map(async shop => {
        const existing = await trx('shop_products')
          .where({
            product_id: numericProductId,
            shop_id: shop.id
          })
          .first();

        await trx('shop_products')
          .where({
            product_id: numericProductId,
            shop_id: shop.id
          })
          .update({
            retail_price: priceData.retail,
            wholesale_price: priceData.wholesale,
            updated_at: trx.fn.now()
          });

        // Log price history (retail & wholesale)
        for (const priceType of ['retail', 'wholesale']) {
          const newPrice = priceData[priceType];
          const oldPrice = existing ? existing[`${priceType}_price`] : null;

          if (oldPrice !== newPrice) {
            await trx('price_history').insert({
              product_id: numericProductId,
              shop_id: shop.id,
              price_type: priceType,
              old_price: oldPrice,
              new_price: newPrice,
              changed_by: userId
            });
          }
        }
      });

      await Promise.all(updates);
      return { updatedCount: shops.length };
    });
  }
};

export default ShopPrice;
