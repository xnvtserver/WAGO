// controllers/sales.js
import knex from '../db/knex.js';

export async function getSalesHistory(req, res) {
  const { shopId } = req.params;

  console.log(`Fetching sales history for shop: ${shopId}`);

  try {
    const parsedShopId = parseInt(shopId);

    // Authorization check
    if (req.user.shop_id !== parsedShopId) {
      return res.status(403).json({ message: 'Unauthorized access to shop data' });
    }

    const sales = await knex('orders')
      .where({
        'orders.shop_id': parsedShopId,
        'orders.type': 'sales'
      })
      .join('order_items', 'orders.id', 'order_items.order_id')
      .leftJoin('products', 'order_items.product_id', 'products.id')
      .select(
        'orders.id as order_id',
        'orders.po_number as invoice_number',
        'orders.created_at as date',
        knex.raw('COALESCE(products.name, \'Unknown Product\') as product_name'),
        'order_items.quantity',
        'order_items.price as unit_price',
        knex.raw('(order_items.quantity * order_items.price) as total')
      )
      .orderBy('orders.created_at', 'desc');

    console.log(`Found ${sales.length} sales records for shop ${shopId}`);
    res.json(sales);
  } catch (err) {
    console.error('Sales history error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


export async function recent(req, res) {
  console.log('inside recent sales controller');
  const { shopId } = req.params;

  try {
    const parsedShopId = parseInt(shopId, 10);

    // ✅ Auth
    if (req.user.shop_id !== parsedShopId) {
      return res.status(403).json({ message: 'Unauthorized access to shop data' });
    }

    // 1) Get latest 5 sales directly
    const rows = await knex('sales')
      .where({ 'sales.shop_id': parsedShopId })
      .leftJoin('customers', 'sales.customer_id', 'customers.id')
      .select(
        'sales.id',
        'sales.invoice_number',
        'sales.sale_date as date',
        knex.raw("COALESCE(customers.name, 'Walk-in Customer') as customer"),
        'sales.total_amount',
        'sales.items_sold',
        'sales.payment_details'
      )
      .orderBy('sales.sale_date', 'desc')
      .limit(5);

    // 2) Collect product_ids for single query
    const allProductIds = new Set();
    const parsedPerRow = rows.map(r => {
      const items = safeParseJSON(r.items_sold);
      const payment = safeParseJSON(r.payment_details);
      if (Array.isArray(items)) {
        items.forEach(i => {
          if (i && i.product_id != null) allProductIds.add(Number(i.product_id));
        });
      }
      return { row: r, items: Array.isArray(items) ? items : [], payment };
    });

    let productMap = {};
    if (allProductIds.size > 0) {
      const ids = Array.from(allProductIds);
      const products = await knex('products')
        .whereIn('id', ids)
        .select('id', 'name');
      productMap = products.reduce((acc, p) => {
        acc[String(p.id)] = p.name;
        return acc;
      }, {});
    }

    // 3) Build response
    const formatted = parsedPerRow.map(({ row, items, payment }) => {
      const itemsList = items.length
        ? items.map(i => {
            const name = productMap[String(i.product_id)] || 'Unknown Product';
            const qty = Number(i.quantity) || 0;
            return `${qty} × ${name}`; // ✅ cleaned format
          })
        : ['No items'];

      let paymentMethod = 'Unknown';
      if (payment) {
        if (Array.isArray(payment)) {
          paymentMethod = payment
            .map(p => p.method || p.mode || p.type)
            .filter(Boolean)
            .join(' + ');
        } else if (typeof payment === 'object') {
          paymentMethod = payment.method || payment.mode || payment.type || 'Unknown';
        } else if (typeof payment === 'string') {
          paymentMethod = payment.replace(/^"+|"+$/g, '');
        }
      }

      return {
        id: `TRX-${row.id}`, // ✅ removed `#`
        date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        customer: row.customer,
        items: itemsList, // ✅ array instead of single string
        payment: paymentMethod,
        paymentIcon: getPaymentIcon(paymentMethod),
        status: 'Completed', // ✅ from sales table only
        statusClass: getStatusClass('Completed'),
        total: `₹${Number(row.total_amount).toFixed(2)}`
      };
    });

    return res.json({ transactions: formatted });
  } catch (err) {
    console.error('Recent sales error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}



function safeParseJSON(value) {
  if (!value) return null;
  if (typeof value === 'object') return value; // already parsed JSONB object in pg

  if (typeof value === 'string') {
    const trimmed = value.trim();

    try {
      return JSON.parse(trimmed);
    } catch {
      // If it's wrapped in multiple quotes like """upi""" or '"upi"'
      return trimmed.replace(/^"+|"+$/g, '');
    }
  }

  return null;
}


function getPaymentIcon(method = '') {
  const m = (method || '').toLowerCase();
  if (m.includes('cash')) return 'mr-1 text-gray-500 fas fa-money-bill-wave';
  if (m.includes('upi') || m.includes('gpay') || m.includes('google pay') || m.includes('phonepe') || m.includes('paytm'))
    return 'mr-1 text-green-600 fas fa-mobile-alt';
  if (m.includes('visa')) return 'mr-1 text-blue-500 fab fa-cc-visa';
  if (m.includes('master')) return 'mr-1 text-yellow-500 fab fa-cc-mastercard';
  if (m.includes('amex')) return 'mr-1 text-blue-500 fab fa-cc-amex';
  if (m.includes('apple')) return 'mr-1 text-purple-500 fab fa-cc-apple-pay';
  return 'mr-1 text-gray-400 fas fa-credit-card';
}

function getStatusClass(status) {
  if (status === 'Refunded') return 'text-red-800 bg-red-100';
  if (status === 'Pending') return 'text-yellow-800 bg-yellow-100';
  return 'text-green-800 bg-green-100';
}
