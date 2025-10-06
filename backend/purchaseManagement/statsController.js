import knex from '../db/knex.js';

// GET /api/dashboard/:shopId/stats
export const getDashboardStats = async (req, res) => {
  try {
    const { shopId } = req.params;

    // Total Purchases
    const totalPurchasesResult = await knex('purchase_orders')
      .where('shop_id', shopId)
      .sum('total_amount as total');
    const totalPurchases = totalPurchasesResult[0].total || 0;

    // Active Suppliers
    const activeSuppliersResult = await knex('suppliers')
      .where('shop_id', shopId)
      .count('id as count');
    const activeSuppliers = parseInt(activeSuppliersResult[0].count, 10);

    // Pending Orders
    const pendingOrdersResult = await knex('purchase_orders')
      .where('shop_id', shopId)
      .whereIn('status', ['draft', 'ordered', 'in_transit'])
      .count('id as count');
    const pendingOrders = parseInt(pendingOrdersResult[0].count, 10);

    // Avg. Delivery Time (days)
    const deliveredOrders = await knex('purchase_orders')
      .where('shop_id', shopId)
      .where('status', 'received')
      .select('order_date', 'expected_date');
    
    let avgDeliveryTime = 0;
    if (deliveredOrders.length > 0) {
      const totalDays = deliveredOrders.reduce((sum, o) => {
        const orderDate = new Date(o.order_date);
        const expectedDate = new Date(o.expected_date || o.order_date);
        return sum + ((expectedDate - orderDate) / (1000 * 60 * 60 * 24));
      }, 0);
      avgDeliveryTime = (totalDays / deliveredOrders.length).toFixed(1);
    }

    res.json({
      totalPurchases: `$${parseFloat(totalPurchases).toFixed(2)}`,
      activeSuppliers,
      pendingOrders,
      avgDeliveryTime: `${avgDeliveryTime} days`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
