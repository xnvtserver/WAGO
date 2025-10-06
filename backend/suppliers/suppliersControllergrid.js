import knex from '../db/knex.js';

// GET /api/suppliers/:shopId/top
export const getTopSuppliers = async (req, res) => {
  try {
    const { shopId } = req.params;

    // Fetch suppliers for the shop
    const suppliersList = await knex('suppliers')
      .where('shop_id', shopId)
      .select('id', 'name', 'created_at');

    // Fetch purchase orders for suppliers in this shop
    const supplierIds = suppliersList.map(s => s.id);
    const orders = await knex('purchase_orders')
      .whereIn('supplier_id', supplierIds)
      .andWhere('shop_id', shopId)
      .select('id', 'supplier_id', 'total_amount', 'order_date');

    // Aggregate data per supplier
    const supplierMap = {};
    suppliersList.forEach(s => {
      supplierMap[s.id] = {
        id: s.id,
        name: s.name,
        since: s.created_at.getFullYear(),
        orders: 0,
        totalSpent: 0,
        lastOrder: null,
      };
    });

    orders.forEach(order => {
      const sup = supplierMap[order.supplier_id];
      sup.orders += 1;
      sup.totalSpent += parseFloat(order.total_amount || 0);
      const orderDate = new Date(order.order_date);
      if (!sup.lastOrder || orderDate > new Date(sup.lastOrder)) {
        sup.lastOrder = orderDate.toISOString().split('T')[0];
      }
    });

    // Format totalSpent as currency
    const response = Object.values(supplierMap).map(s => ({
      ...s,
      totalSpent: `$${s.totalSpent.toFixed(2)}`,
      lastOrder: s.lastOrder || '-',
    }));

    res.json(response);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch top suppliers' });
  }
};
