import knex from "../db/knex.js";

// GET /api/purchases/:shopId/recent
export const getRecentPurchases = async (req, res) => {
    console.log(' inside getRecentPurchases');
  try {
    const { shopId } = req.params;

    // Fetch purchase orders for the shop
    const purchases = await knex('purchase_orders')
      .where('shop_id', shopId)
      .orderBy('order_date', 'desc')
      .limit(20) // recent 20
      .select(
        'purchase_orders.id',
        'purchase_orders.order_date',
        'purchase_orders.expected_date',
        'purchase_orders.total_amount',
        'purchase_orders.status',
        'purchase_orders.supplier_id'
      );

    // Fetch supplier info
    const supplierIds = purchases.map(p => p.supplier_id);
    const suppliers = await knex('suppliers')
      .whereIn('id', supplierIds)
      .select('id', 'name', 'contact_email', 'address');

    const supplierMap = {};
    suppliers.forEach(s => {
      supplierMap[s.id] = {
        name: s.name,
        email: s.contact_email,
        avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(s.name),
      };
    });

    // Fetch items count and categories per purchase order
    const purchaseIds = purchases.map(p => p.id);
    const itemsData = await knex('purchase_order_items as poi')
    .join('products as p', 'poi.product_id', 'p.id')
    .whereIn('poi.purchase_order_id', purchaseIds)
    .select('poi.purchase_order_id', 'poi.product_id', 'poi.product_name', 'p.category');


    const purchaseItemsMap = {};
    purchases.forEach(p => {
      purchaseItemsMap[p.id] = { items: 0, categories: new Set() };
    });

    itemsData.forEach(item => {
      purchaseItemsMap[item.purchase_order_id].items += 1;
      if (item.category) purchaseItemsMap[item.purchase_order_id].categories.add(item.category);
    });

    // Format final response
    const response = purchases.map(p => ({
      id: `#PO-${p.id.toString().padStart(3, '0')}`,
      supplier: supplierMap[p.supplier_id],
      date: p.order_date.toISOString().split('T')[0],
      dueDate: p.expected_date ? p.expected_date.toISOString().split('T')[0] : '-',
      items: purchaseItemsMap[p.id].items,
      categories: purchaseItemsMap[p.id].categories.size,
      total: `$${parseFloat(p.total_amount).toFixed(2)}`,
      status: capitalizeStatus(p.status),
    }));

    res.json(response);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
};

// Helper: Capitalize first letter of status
const capitalizeStatus = (status) => status.charAt(0).toUpperCase() + status.slice(1);

