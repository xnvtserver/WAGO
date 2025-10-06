// inventory/models/shopProduct.js
import db from '../models/index.js';

const TABLE_NAME = 'shop_products';

const ShopProduct = {
  async findById(id) {
    return db(TABLE_NAME).where({ id }).first();
  },

  async findAllByShop(shopId, filters = {}) {
    let query = db(TABLE_NAME).where({ shop_id: shopId });

    if (filters.status) query = query.andWhere('status', filters.status);
    if (filters.sku) query = query.andWhere('sku', 'ilike', `%${filters.sku}%`);
    if (filters.barcode) query = query.andWhere('barcode', 'ilike', `%${filters.barcode}%`);

    return query;
  },

  async create(data) {
    return db(TABLE_NAME).insert(data).returning('*');
  },

  async update(id, data) {
    return db(TABLE_NAME).where({ id }).update(data).returning('*');
  },

  async delete(id) {
    return db(TABLE_NAME).where({ id }).del();
  }
};

export default ShopProduct;
