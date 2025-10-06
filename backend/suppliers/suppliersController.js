import db from "../db/knex.js";

// ➕ Create Supplier
export const createSupplier = async (req, res) => {
  try {
    const { shop_id } = req.user;
    const supplierData = req.body;

    // 🔍 1. Get company_id using shop_id
    // const shop = await db('shops').where({ id: shop_id }).first();

    // if (!shop) {
    //   return res.status(404).json({ message: 'Shop not found' });
    // }

    // const company_id = shop.company_id; // ✅ Get company_id from shops table

    // 📝 2. Insert supplier with both IDs
    const result = await db('suppliers').insert({
      name: supplierData.name,
      contact_email: supplierData.contact_email,
      contact_phone: supplierData.contact_phone,
      gstin: supplierData.gstin,
      address: supplierData.address,
      // company_id: company_id,   // ✅ valid foreign key
      shop_id: shop_id          // from JWT
    }).returning('*');

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create Supplier Error:', error.message);
    res.status(500).json({ message: 'Failed to create supplier' });
  }
};

// ✏️ Update Supplier
export const updateSupplier = async (req, res) => {
  const { supplierId } = req.params;
  const updates = req.body;

  try {
    const updatedSuppliers = await db('suppliers')
      .where({ id: supplierId })
      .update(updates)
      .returning('*');

    if (updatedSuppliers.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(updatedSuppliers[0]);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ❌ Delete Supplier
export const deleteSupplier = async (req, res) => {
  const { supplierId } = req.params;

  try {
    const deletedCount = await db('suppliers')
      .where({ id: supplierId })
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ❌ unlinking the Supplier from the user shop 
export const unlinkSupplierFromShop = async (req, res) => {
  const { shopId, supplierId } = req.params;

  try {
    const result = await db('suppliers')
      .where({ id: supplierId, shop_id: shopId })
      .update({ shop_id: null });

    if (result === 0) {
      return res.status(404).json({ error: 'Supplier not found for this shop' });
    }

    res.status(200).json({ message: 'Supplier unlinked from shop successfully' });
  } catch (error) {
    console.error('Error unlinking supplier:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// 📄 Get All Suppliers for a shop
export const listSuppliers = async (req, res) => {
  const { shop_id } = req.params;

  try {
    const suppliers = await db('suppliers')
      .where({ shop_id })
      .select('*');

    res.json(suppliers);
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    res.status(500).json({ message: 'Error fetching suppliers' });
  }
};

// 📦 2. Purchase Order Management
// ➕ Create Purchase Order with Items
export const createPurchaseOrder = async (req, res) => {
  const { shopId, supplierId } = req.params;
  const { status, order_date, expected_date, notes, items } = req.body;
  
  try {
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const total_tax = items.reduce((sum, item) => 
      sum + item.cgst_amount_per_item + item.sgst_amount_per_item + 
           item.igst_amount_per_item + item.cess_amount_per_item, 0);
    const grand_total = subtotal + total_tax;

    // Create PO
    const [newOrder] = await db('purchase_orders')
      .insert({
        shop_id: shopId,
        supplier_id: supplierId,
        order_date,
        expected_date,
        subtotal,
        total_tax,
        grand_total,
        notes,
        status
      })
      .returning('*');

    // Create PO items
    const orderItems = items.map(item => ({
      purchase_order_id: newOrder.id,
      product_id: item.product_id,
      product_name: item.product_name,
      hsn_sac_code: item.hsn_sac_code,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount_per_item: item.discount_per_item,
      taxable_value: item.taxable_value,
      gst_rate_percentage: item.gst_rate_percentage,
      cgst_amount_per_item: item.cgst_amount_per_item,
      sgst_amount_per_item: item.sgst_amount_per_item,
      igst_amount_per_item: item.igst_amount_per_item,
      cess_amount_per_item: item.cess_amount_per_item,
      total_item_amount: item.total_item_amount
    }));

    await db('purchase_order_items').insert(orderItems);

    res.status(201).json(newOrder);
  } catch (err) {
    console.error('❌ Error in createPurchaseOrder:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ✏️ Update Purchase Order Status
export const updatePOStatus = async (req, res) => {
  const { purchaseOrderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrders = await db('purchase_orders')
      .where({ id: purchaseOrderId })
      .update({ status })
      .returning('*');

    if (updatedOrders.length === 0) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    // If status changed to 'received', update inventory
    if (status === 'received') {
      await receivePurchaseOrder(purchaseOrderId);
    }

    res.json(updatedOrders[0]);
  } catch (error) {
    console.error('Error updating purchase order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 📄 List POs by Shop or Supplier
export const listPOsByShop = async (req, res) => {
  return await db('purchase_orders')
    .where({ shop_id: shopId })
    .select('*');
};

export const listPOsBySupplier = async (req, res) => {
  return await db('purchase_orders')
    .where({ supplier_id: supplierId })
    .select('*');
};

// 🛒 3. Sync Purchase Order Items to shop_products
// When a PO is marked as 'received', stock must be added to shop_products.
// ✅ Apply PO to Shop Inventory
export const receivePurchaseOrder = async (req, res) => {
  return await db.transaction(async trx => {
    // Update status
    await trx('purchase_orders')
      .where({ id: purchaseOrderId })
      .update({ status: 'received' });

    const items = await trx('purchase_order_items')
      .where({ purchase_order_id: purchaseOrderId });

    for (const item of items) {
      // Try to find existing shop_product
      const shopProduct = await trx('shop_products')
        .where({ shop_id: item.shop_id, product_id: item.product_id })
        .first();

      if (shopProduct) {
        // Update existing stock
        await trx('shop_products')
          .where({ id: shopProduct.id })
          .increment('stock', item.quantity)
          .update({
            purchase_price: item.unit_price,
            updated_at: new Date()
          });
      } else {
        // Insert new shop product
        await trx('shop_products').insert({
          shop_id: item.shop_id,
          product_id: item.product_id,
          sku: generateSKU(item.product_id, item.shop_id), // Custom SKU gen
          barcode: await getProductBarcode(db, item.product_id),
          retail_price: item.unit_price * 1.2, // Example margin logic
          wholesale_price: item.unit_price * 1.1,
          purchase_price: item.unit_price,
          stock: item.quantity,
          status: 'active',
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }
  });
};

// Helper for Barcode:
export const getProductBarcode = async (req, res) => {
  const product = await db('products').where({ id: productId }).first();
  return product?.barcode;
};

// Helper for SKU
function generateSKU(productId, shopId) {
  return `SKU-${shopId}-${productId}-${Date.now()}`;
}

// 📄 List POs by both Shop and Supplier
export const listPOsByShopAndSupplier = async (req, res) => {
  const shopId = req.user?.shop_id || req.params.shopId;
  const supplierId = req.params.supplierId;

  console.log('***********', { shopId, supplierId }, '***************');

  if (!shopId || !supplierId) {
    return res.status(400).json({ error: 'Missing shopId or supplierId' });
  }

  try {
    const purchaseOrders = await db('purchase_orders')
      .where({ shop_id: shopId, supplier_id: supplierId });

    return res.status(200).json(purchaseOrders);
  } catch (error) {
    console.error('Error fetching purchase orders by shop and supplier:', error);
    return res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
};



// ✅ Suggested Flow Diagram
// createSupplier → creates supplier.
// createPurchaseOrder → creates PO + items.
// updatePOStatus to 'received' → triggers receivePurchaseOrder
// receivePurchaseOrder updates shop_products.
// listPOsByShopAndSupplier 