import express from'express';
const router = express.Router();
import knex from'../db/knex';

// Get shop prices for a product
router.get('/shop-prices/:productId', async (req, res) => {
  try {
    const prices = await knex('shop_prices')
      .where({ product_id: req.params.productId })
      .join('shops', 'shop_prices.shop_id', 'shops.id')
      .select('shop_prices.*', 'shops.name as shop_name', 'shops.location', 'shops.status');

    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get price history
router.get('/history/:productId', async (req, res) => {
    try {
      const history = await knex('price_history')
        .where({ product_id: req.params.productId })
        .orderBy('created_at', 'desc');
  
      res.json(history);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  
// Update shop price
router.put('/shop-prices/:id', async (req, res) => {
  try {
    const { retail_price, wholesale_price } = req.body;
    
    const updatedPrice = await knex('shop_prices')
      .where({ id: req.params.id })
      .update({
        retail_price,
        wholesale_price,
        updated_at: knex.fn.now()
      })
      .returning('*');

    // Log price history
    await knex('price_history').insert({
      product_id: updatedPrice[0].product_id,
      shop_id: updatedPrice[0].shop_id,
      price_type: 'shop',
      old_price: JSON.stringify(updatedPrice[0]),
      new_price: JSON.stringify(req.body),
      changed_by: 'admin' // Replace with actual user from auth
    });

    res.json(updatedPrice[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;