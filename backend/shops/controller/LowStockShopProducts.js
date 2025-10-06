// backend/shops/controller/LowStockShopProducts.js

import db from "../../config/db.js";

export const getLowStockProducts = async (req, res) => {
  console.log('Inside the getLowStockProducts');

try {
  console.log('🔐 Attempting to extract shop ID from JWT payload...');
  const shopId = req.user?.shop_id;

  if (!shopId) {
    console.error('❌ shop_id not found in req.user. JWT may be missing or malformed.');
    return res.status(401).json({ error: 'Unauthorized: shop_id missing in token' });
  }

  console.log(`✅ shop_id extracted: ${shopId}`);

  const {
    page = 1,
    pageSize = 10,
    sortBy = 'stock',
    sortOrder = 'asc',
    search = ''
  } = req.query;

  console.log('🔍 Query parameters received:', {
    page,
    pageSize,
    sortBy,
    sortOrder,
    search
  });

  const sortMappings = {
    stock: 'sp.stock',
    name: 'p.name',
    retail_price: 'sp.retail_price',
    wholesale_price: 'sp.wholesale_price'
  };

  const sortColumn = sortMappings[sortBy] || 'sp.stock';
  const offset = (page - 1) * pageSize;

  console.log(`📊 Sorting by: ${sortColumn} (${sortOrder}), Offset: ${offset}`);

  // Main data query
  let query = db('shop_products as sp')
    .join('products as p', 'p.id', 'sp.product_id')
    .join('shops as s', 's.id', 'sp.shop_id')
    .where('sp.shop_id', shopId)
    .whereRaw('sp.stock <= sp.reorder_threshold')
    .where(function () {
      this.where('p.name', 'ilike', `%${search}%`)
        .orWhere('sp.sku', 'ilike', `%${search}%`)
        .orWhere('sp.barcode', 'ilike', `%${search}%`);
    })
    .select(
      'sp.id',
      'sp.sku',
      'sp.barcode',
      'sp.stock',
      'sp.reorder_threshold',
      'sp.retail_price',
      'sp.wholesale_price',
      'sp.purchase_price',
      'p.name as product_name',
      'p.image as product_image',
      's.name as shop_name'
    )
    .orderBy(sortColumn, sortOrder)
    .limit(pageSize)
    .offset(offset);

  const results = await query;

  console.log(`📦 Retrieved ${results.length} products.`);

  // Total count query
  console.log('🔢 Running count query...');
  const totalResult = await db('shop_products as sp')
    .where('sp.shop_id', shopId)
    .whereRaw('sp.stock <= sp.reorder_threshold')
    .count('* as count')
    .first();

  const total = parseInt(totalResult.count);
  console.log(`📈 Total low stock products: ${total}`);

  res.json({
    data: results,
    total,
    page: parseInt(page),
    pageSize: parseInt(pageSize),
    totalPages: Math.ceil(total / pageSize)
  });

  console.log('✅ Response sent successfully.');

} catch (error) {
  console.error('❌ Error fetching low stock products:', error);
  res.status(500).json({ error: 'Internal server error' });
}

};


export const getshoppromo = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid shop ID' });
    }

    const result = await db('shops as s')
      .leftJoin('promotions as p', function () {
        this.on('p.shop_id', '=', 's.id')
          .andOn(db.raw('CURRENT_DATE BETWEEN ?? AND ??', ['p.start_date', 'p.end_date']));
      })
      .where('s.id', parseInt(id))
      .select(
        's.name',
        's.location',
        's.phone',
        's.email',
        'p.offer_text as current_offer'
      )
      .first();

    if (!result) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json(result);
  } catch (err) {
    console.error('Error fetching shop info:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

