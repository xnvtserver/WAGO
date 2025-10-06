import db from "../../config/db.js";


export const updateInventoryItemHandler = async (req, res) => {
  try {
    const { shopId, id } = req.params;
    const updates = req.body;
    const status = req.body.status;
    // 1. Authentication & Authorization
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Please login' });
    }

    // // 2. Validate shop access
    // const shopAccess = await db('shop_permissions')
    //   .where({
    //     user_id: req.user.id,
    //     shop_id: shopId,
    //     permissions: '@> {manage_inventory}' // Using PostgreSQL array containment operator
    //   })
    //   .first();

    // if (!shopAccess) {
    //   return res.status(403).json({ error: 'Unauthorized - No inventory management privileges' });
    // }

    // 3. Update database
    const updatedItem = await db('shop_products')
      .where({ id, shop_id: shopId })
      .update({
        retail_price: updates.price,
        stock: updates.stock,
        status: status,
        updated_at: db.fn.now()
      })
      .returning(['id', 'retail_price as price', 'stock', 'status', 'updated_at']);
    console.log('UPDATED STATUS IS: ' + status);
    // 4. Handle missing items
    if (updatedItem.length === 0) {
      return res.status(404).json({ error: 'Item not found in this shop' });
    }

    // 5. Return updated data
    res.json({
      success: true,
      data: updatedItem[0]
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      error: 'Server error during update',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Get shop products -- used mainly for inventory table
export const getShopProducts = async (req, res) => {
  try {
    const shopId = parseInt(req.params.shopId, 10);
    const { search = '', category = '', status = '', page = 1 } = req.query;

    if (isNaN(shopId)) {
      return res.status(400).json({ error: 'Invalid shop ID' });
    }

    const limit = 10;
    const offset = (page - 1) * limit;

    let query = db('shop_products')
      .where('shop_products.shop_id', shopId)
      .join('products', 'shop_products.product_id', 'products.id');

    // Apply search filter
    if (search) {
      query = query.andWhere(function () {
        this.where('products.name', 'ilike', `%${search}%`)
          .orWhere('shop_products.sku', 'ilike', `%${search}%`);
      });
    }

    // Apply category filter
    if (category) {
      query = query.andWhere('products.category', category);
    }

    // Apply status filter
    if (status) {
      if (status === 'active') {
        query = query.andWhere('products.is_active', true).andWhere('shop_products.stock', '>', 0);
      } else if (status === 'out-of-stock') {
        query = query.andWhere('shop_products.stock', 0);
      } else if (status === 'discontinued') {
        query = query.andWhere('products.is_active', false);
      }
    }

    // Clone the query for counting total
    const countQuery = query.clone().countDistinct('shop_products.id as total');

    // Apply pagination
    query = query
      .select(
        'shop_products.id as shop_product_id',
        'shop_products.sku',
        'shop_products.stock',
        'shop_products.retail_price as price',
        'shop_products.barcode',
        'shop_products.status',
        'products.id as product_id',
        'products.name',
        'products.description',
        'products.category',
        'products.brand',
        'products.unit',
        'products.unit_value',
        'products.image',
        'products.is_active',
        'products.created_at',
        'products.updated_at'
      )
      .limit(limit)
      .offset(offset);

    const [products, countResult] = await Promise.all([query, countQuery]);
    const total = parseInt(countResult[0].total, 10);
    const totalPages = Math.ceil(total / limit);

    res.json({
      items: products,
      total,
      totalPages,
      page: Number(page)
    });
  } catch (error) {
    console.error('Error fetching shop products:', error);
    res.status(500).json({ error: `Failed to fetch shop products. Error: ${error.message}` });
  }
};


// Create shop (owner only)
export const createShop = async (req, res) => {
  try {
    console.log('Received req.body:', req.body); // <== log the incoming body
    console.log('Received Content-Type:', req.headers['content-type']); // <== confirm it's JSON
    console.log('req.headers:', req.headers);
    console.log('req.body:', req.body);
    
    const [shop] = await db('shops').insert({
      name: req.body.name,
      location: req.body.location,
      phone: req.body.phone,
      email: req.body.email,
      upi_id: req.body.upi_id || null,
      gstin: req.body.gstin || null,
      parent_shop_id: req.body.parent_shop_id || null,
      owner_id: req.user.id
    }).returning('*');

    res.status(201).json(shop);
  } catch (error) {
    console.error('Shop Creation Error:', error);
    res.status(500).json({ error: error.message });
  }
};


