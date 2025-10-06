//Backend/product/models/product.js
import db from '../../config/db.js';

class Product {
  static async create(productData) {
    return db('products')
      .insert(productData)
      .returning('*')
      .then(rows => rows[0]);
  }

  static async findAll() {
    return db('products').select('*');
  }

  static async findById(id) {
    return db('products').where({ id }).first();
  }

  static async findBySku(sku) {
    return db('products').where({ sku }).first();
  }

  static async findByBarcode(barcode) {
    return db('products').where({ barcode }).first();
  }

  static async update(id, productData) {
    return db('products')
      .where({ id })
      .update(productData)
      .returning('*')
      .then(rows => rows[0]);
  }

  static async delete(id) {
    return db('products').where({ id }).del();
  }

  static async search(query) {
    return db('products')
      .where('name', 'ilike', `%${query}%`)
      .orWhere('sku', 'ilike', `%${query}%`)
      .orWhere('barcode', 'ilike', `%${query}%`);
  }
}

export default Product;