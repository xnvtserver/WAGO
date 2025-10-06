//Backend/Billing/controller/BillingController.js
import knex from '../../db/knex.js';

export default class BillingController {

//barcode utility 
static async getProductByBarcode(req, res) {
  try {
    const shopId = req.user.shop_id;
    const { barcode } = req.params;

    const product = await knex('shop_products')
      .select(
        'products.id',
        'products.name',
        'shop_products.retail_price as price',
        'shop_products.stock'
      )
      .join('products', 'shop_products.product_id', 'products.id')
      .where('shop_products.shop_id', shopId)
      .where('shop_products.barcode', barcode)
      .first();

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Barcode lookup error:', error);
    res.status(500).json({ error: 'Failed to lookup product' });
  }
}

  // Get products for the current shop
  static async getShopProducts(req, res) {
    console.log('getShopProducts called');
    try {
      const shopId = req.user.shop_id;
      console.log('Shop ID from request user:', shopId);

      if (shopId === undefined || shopId === null) {
        console.error('Error: shop_id is undefined or null in req.user');
        return res.status(400).json({ error: 'Invalid shop information' });
      }

      const products = await knex('shop_products')
        .select(
          'products.id',
          'products.name',
          'shop_products.retail_price as price',
          'shop_products.stock',
          'shop_products.barcode'
        )
        .join('products', 'shop_products.product_id', 'products.id')
        .where('shop_products.shop_id', shopId) // Use the retrieved shopId
        .where('products.is_active', true);
      console.log('Products fetched:', products);
      res.json({ products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  // Process the sale and update stock
static async processSale(req, res) {
  console.log(' INSIDE CONTROLLER METHOD ProcessSale ');
  const transaction = await knex.transaction();
  try {
    const shopId = req.user.shop_id;
    // Destructure specific tax components, or a total tax amount.
    // For this correction, I'm assuming 'tax' from req.body
    // is a single value, and we need to map it to the database's
    // detailed tax columns. In a real-world GST scenario, you'd
    // likely receive total_cgst_amount, total_sgst_amount, etc., directly.
    let {
      items,
      discount = 0,
      payment_details = {},
      billCustomer,
      // Assuming these are now sent from the frontend for detailed tax breakdown
      // If not, you'd need logic to calculate them here based on item details
      total_cgst_amount = 0,
      total_sgst_amount = 0,
      total_igst_amount = 0,
      total_cess_amount = 0,
      total_taxable_value = 0, // This is crucial for GST calculations
      invoice_number, // You added this to your migration, it's required
      document_type = 'invoice', // Default value from migration
      supply_type, // Required by migration
      is_b2b = false, // Default value from migration
      is_reverse_charge = false, // Default value from migration
      customer_id = null, // Optional, can be null
      customer_gstin = null // Optional, can be null
    } = req.body;


    // Basic validation for required fields added in migration
    if (!invoice_number) {
      await transaction.rollback();
      console.log('400 Invoice number is required.');
      return res.status(400).json({ error: 'Invoice number is required.' });
    }
    if (!supply_type) {
      await transaction.rollback();
      console.log('400 Supply type is required (intra_state, inter_state, export, sez_supply)');
      return res.status(400).json({ error: 'Supply type is required (intra_state, inter_state, export, sez_supply).' });
    }


    // 1. Validate stock
    for (const item of items) {
      const product = await transaction('shop_products')
        .select('stock', 'retail_price')
        .where('shop_id', shopId)
        .where('product_id', item.product_id)
        .first();

      if (!product || product.stock < item.quantity) {
        await transaction.rollback();
        console.log('Insufficient stock for product ID');
        return res.status(400).json({
          error: `Insufficient stock for product ID ${item.product_id}`,
        });
      }

      // Add price to item for later calculation
      item.unit_price = product.retail_price;
    }

    // 2. Update stock
    for (const item of items) {
      await transaction('shop_products')
        .where('shop_id', shopId)
        .where('product_id', item.product_id)
        .decrement('stock', item.quantity);
    }

    // 3. Calculate sale totals
    const itemsSold = items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price, // Include unit price for comprehensive record
      // You might also want to include applied taxes per item for proper GST breakdown
      // e.g., cgst_rate, sgst_rate, igst_rate, cess_rate, taxable_value_per_item
    }));

    // Calculate subtotal based on unit price and quantity
    const subtotal = items.reduce(
      (acc, item) => acc + (item.unit_price * item.quantity),
      0
    );

    // Ensure total_amount calculation is accurate based on all tax components
    // If you are calculating total_taxable_value, total_cgst_amount, etc.,
    // the `total_amount` should be their sum plus total_discount_amount subtracted if applicable
    const totalAmount = subtotal + total_cgst_amount + total_sgst_amount + total_igst_amount + total_cess_amount - discount;

    // 4. Insert into sales table
console.log('Received billCustomer:', billCustomer);
try{
if (billCustomer && (billCustomer.name || billCustomer.phone || billCustomer.address)) {
  const newCustomer = await transaction('customers')
    .insert({
      shop_id: shopId,
      name: billCustomer.name || null,
      phone: billCustomer.phone || null,
      address: JSON.stringify(billCustomer.address || null),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    })
    .returning('id');
  console.log('Customer insert result:', newCustomer);

  customer_id = typeof newCustomer === 'object' ? newCustomer.id : newCustomer;
}
} catch (err) {
  console.error('Error inserting customer:', err);
  await transaction.rollback();
  return res.status(500).json({ error: 'Failed to insert customer', details: err.message });
}
const [saleId] = await transaction('sales')
  .insert({
    shop_id: shopId,
    customer_id: customer_id, // Set from billCustomer insert above
    customer_gstin: customer_gstin,
    invoice_number: invoice_number,
    discount_amount: discount,
    items_sold: JSON.stringify(itemsSold),
    document_type: document_type,
    total_taxable_value: total_taxable_value,
    total_cgst_amount: total_cgst_amount,
    total_sgst_amount: total_sgst_amount,
    total_igst_amount: total_igst_amount,
    total_cess_amount: total_cess_amount,
    total_discount_amount: discount,
    total_amount: totalAmount,
    supply_type: supply_type,
    is_b2b: is_b2b,
    is_reverse_charge: is_reverse_charge,
    payment_details: JSON.stringify(payment_details),
    sale_date: knex.fn.now(),
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  })
  .returning('id');



      // 5. Insert into orders table (type: 'sales')
const [order] = await transaction('orders')
  .insert({
    shop_id: shopId,
    customer_id: customer_id,
    shipping_address: null,
    po_number: invoice_number,
    customer_name: null,
    total_amount: totalAmount,
    status: 'completed',
    type: 'sales',
    created_at: knex.fn.now()
  })
  .returning('id');

  const orderId = order.id;

// 6. Insert each item into order_items table
for (const item of items) {
  await transaction('order_items').insert({
    order_id: orderId,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.unit_price,
    shop_id: shopId,
    type: 'sales'
  });
}

    await transaction.commit();
    res.json({ success: true, sale_id: saleId });
  } catch (error) {
    await transaction.rollback();
    console.error('Error processing sale:', error);
    // Be more specific in error response for debugging by the frontend
    res.status(500).json({ error: 'Failed to process sale', details: error.message });
  }
}

}