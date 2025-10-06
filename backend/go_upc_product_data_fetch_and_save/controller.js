import axios  from 'axios';
import knex from'../db/knex';

async function getProductByBarcode(req, res) {
  const { barcode, shopId } = req.params; // assuming shopId is passed in the URL
  const {
    sku,
    retail_price,
    wholesale_price,
    purchase_price,
    stock
  } = req.body; // shop-specific data

  try {
    // Check existing product
    const existingProduct = await knex('products')
      .where({ barcode })
      .first();

    if (existingProduct) {
      // Link to shop_products if not already linked
      const shopProduct = await knex('shop_products')
        .where({ product_id: existingProduct.id, shop_id: shopId })
        .first();

      if (!shopProduct) {
        await knex('shop_products').insert({
          product_id: existingProduct.id,
          shop_id: shopId,
          sku,
          barcode,
          retail_price,
          wholesale_price,
          purchase_price,
          stock
        });
      }

      return res.json(existingProduct);
    }

    // Fetch from Go-UPC API
    const response = await axios.get(`https://api.go-upc.com/v1/barcode/${barcode}`, {
      headers: {
        Authorization: `Bearer ${process.env.GO_UPC_API_KEY}`
      }
    });

    const apiProduct = response.data.product;

    const productData = {
      barcode: apiProduct.barcodeNumber,
      name: apiProduct.name,
      description: apiProduct.description,
      image: apiProduct.imageUrl,
      brand: apiProduct.brand,
      category: apiProduct.category || 'General',
      unit: 'USD', // Adjust if needed
      unit_value: apiProduct.offers?.[0]?.price?.toString() || '0.00'
    };

    const product = await db.transaction(async trx => {
      // Insert product
      const [insertedProduct] = await trx('products').insert(productData).returning('*');

      // Insert shop-specific data
      await trx('shop_products').insert({
        product_id: insertedProduct.id,
        shop_id: shopId,
        sku,
        barcode,
        retail_price,
        wholesale_price,
        purchase_price,
        stock
      });

      return insertedProduct;
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('Error:', error.message);

    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(500).json({
      error: 'Failed to retrieve product',
      details: error.message
    });
  }
}


module.exports = {
  getProductByBarcode
};