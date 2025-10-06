//Backend/Dashboard/dashboardController.js
import db from '../config/db.js';

export default {
  async getDashboardStats(req, res) {
    try {
      const shopId = req.user.shop_id;
      const today = new Date().toISOString().split('T')[0];

      const [sales, orders, customers, inventory] = await Promise.all([
        db('sales')
          .where('shop_id', shopId)
          .whereRaw('DATE(sale_date) = ?', [today])
          .sum('total_amount as total')
          .first(),

        db('orders')
          .where('shop_id', shopId)
          .whereRaw('DATE(created_at) = ?', [today])
          .count('id as total')
          .first(),

        db('customers')
          .where('shop_id', shopId)                // customers table has no shop_id column
          .whereRaw('DATE(created_at) = ?', [today])
          .countDistinct('id as total')  // customers table primary key is id, no customer_id column
          .first(),

        db('shop_products')
          .where('shop_id', shopId)
          .andWhere('stock', '<', 10)
          .count('id as total')
          .first(),

      ]);

      // Proper destructuring with fallbacks
      const todaySales = Number(sales?.total) || 0;
      const todayOrders = Number(orders?.total) || 0;
      const todayCustomers = Number(customers?.total) || 0;
      const todayRevenue = Number(inventory?.total) || 0;

      res.json({
        todaySales,
        todayOrders,
        todayCustomers,
        todayRevenue
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({
        error: 'Failed to load dashboard stats',
        details: error.message
      });
    }
  },

  async getSalesData(req, res) {
    console.log('*************** working on getSalesData ********************');
    try {
      const salesData = await db('sales')
        .select(db.raw("DATE_TRUNC('day', sale_date) as date"))
        .sum('total_amount as amount')
        .where('shop_id', req.user.shop_id)
        .groupBy('date')
        .orderBy('date');

      res.json(salesData);
    } catch (error) {
      console.error('getSalesData error:', error);
      res.status(500).json({ error: 'Failed to load sales data' });
    }
  },


  async getRecentOrders(req, res) {
    console.log('*************** working on getRecentOrders ******************');
    try {
      const orders = await db('orders')
        .where('shop_id', req.user.shop_id)
        .orderBy('created_at', 'desc')
        .limit(5)
        .select('po_number', 'customer_name', 'total_amount', 'status', 'created_at');

      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load recent orders' });
    }
  },

  async getTopProducts(req, res) {
    try {
      const shopId = req.user.shop_id;

      const result = await db
        .with('exploded', (qb) => {
          qb.select(
            db.raw("(item->>'product_id')::int AS product_id"),
            db.raw("(item->>'quantity')::numeric AS quantity")
          )
            .from('sales')
            .where('shop_id', shopId)
            .joinRaw('JOIN LATERAL jsonb_array_elements(items_sold) AS item ON TRUE');
        })
        .select('products.name')
        .sum({ sales: 'exploded.quantity' })
        .from('exploded')
        .join('shop_products', 'exploded.product_id', 'shop_products.product_id')
        .join('products', 'shop_products.product_id', 'products.id')
        .where('shop_products.shop_id', shopId)
        .groupBy('products.name')
        .orderBy('sales', 'desc')
        .limit(5);

      // Convert numeric values to floats
      const formattedResult = result.map(row => ({
        name: row.name,
        sales: parseFloat(row.sales)
      }));

      res.json(formattedResult);
    } catch (error) {
      console.error('Error executing SQL query:', error);
      res.status(500).json({ error: 'Failed to load top products' });
    }
  },

  async getInventoryAlerts(req, res) {
    console.log('*************** working on getInventoryAlerts ******************');
    try {
      const alerts = await db('shop_products')
        .join('products', 'shop_products.product_id', 'products.id')
        .where('shop_products.shop_id', req.user.shop_id)
        .where('stock', '<', 10)
        .select('products.name', 'shop_products.stock');

      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load inventory alerts' });
    }
  },


  async getStoreInventory(req, res) {
    try {
      const inventory = await db('shop_products')
        .where('shop_products.shop_id', req.user.shop_id)
        .join('products', 'shop_products.product_id', 'products.id')
        .select(
          'products.id',
          'products.name',
          'shop_products.stock',
          'shop_products.retail_price'
        );

      res.json(inventory);
    } catch (error) {
      console.error('Store inventory error:', error);
      res.status(500).json({ error: 'Failed to load store inventory' });
    }
  }
};