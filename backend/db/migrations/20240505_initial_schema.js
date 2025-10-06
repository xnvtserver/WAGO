// migrations/YYYYMMDDHHMMSS_initial_schema.js 

export async function up(knex) {
  // Create custom enum first
  await knex.raw(`
    CREATE TYPE permission_type AS ENUM (
      'view_inventory',
      'manage_inventory',
      'view_dashboard',
      'process_sales',
      'view_reports',
      'manage_pricing',
      'handle_customers'
    )
  `);

  await knex.raw(`
    CREATE TYPE plan_type AS ENUM (
      'ultimate',
      'enterprise',
      'standard',
      'express'
    )
  `);

  // Create enum type for protocol (PostgreSQL only)
  await knex.raw(`
    CREATE TYPE scale_protocols AS ENUM (
      'CAS_CI201A',
      'AVERY_BERKEL',
      'METTLER_TOLEDO',
      'CUSTOM'
    )
  `);

  // Companies table for multi-tenant support
  await knex.schema.createTable('companies', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('tax_id').unique();
    table.enu('plan', ['ultimate', 'enterprise', 'standard', 'express'])
      .notNullable()
      .defaultTo('express');
    table.jsonb('enabled_features').defaultTo('[]');
    table.timestamps(true, true);
  });

  // Users table (no shop references) (now company-linked Users table)
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    // table.integer('company_id').unsigned().notNullable().references('id').inTable('companies').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('phone').notNullable();
    table.string('license_file');
    table.boolean('terms_accepted').defaultTo(false);
    table.enu('role', ['owner', 'employee', 'customer'])
      .notNullable()
      .defaultTo('customer');
      // ✅ Settings column (JSON)
    table.jsonb('settings').defaultTo('{}');
    table.timestamps(true, true);
  });

  // Shops table with owner reference , Shops table now belongs to companies
  await knex.schema.createTable('shops', (table) => {
    table.increments('id').primary();
    // table.integer('company_id').unsigned().notNullable().references('id').inTable('companies').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('location');
    table.string('phone').notNullable();
    table.string('email').notNullable();
    table.string('upi_id'); // ✅ UPI ID field for the shop
    table.string('gstin').unique().nullable(); // ✅ GSTIN for shop
    table.enu('status', ['active', 'inactive', 'needs-update'])
      .defaultTo('active');
    table.integer('owner_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.integer('parent_shop_id');
    table.timestamps(true, true);
  });

  // Create the scale_configurations table
  await knex.schema.createTable('scale_configurations', table => {
    table.uuid('id').primary();
    table.integer('shop_id').unsigned().notNullable().references('id').inTable('shops').onDelete('CASCADE');
    table.specificType('protocol', 'scale_protocols').notNullable();
    table.jsonb('serial_config').notNullable();
    table.jsonb('data_parsing_config').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Suppliers table
  await knex.schema.createTable('suppliers', (table) => {
    table.increments('id').primary();
    // table.integer('company_id').unsigned().notNullable()
    //   .references('id').inTable('companies').onDelete('CASCADE').defaultTo(0);
    table.integer('shop_id').unsigned().references('id').inTable('shops').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('contact_email');
    table.string('contact_phone');
    table.string('gstin').nullable(); // ✅ Supplier GSTIN
    table.jsonb('address');
    table.timestamps(true, true);
  });
  // Distributors table (enhanced suppliers)
  await knex.schema.createTable('distributors', (table) => {
    table.increments('id').primary();
    table.integer('company_id').unsigned().notNullable()
      .references('id').inTable('companies').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('contact_email');
    table.string('contact_phone');
    table.string('gstin').nullable();
    table.enu('type', ['wholesaler', 'manufacturer', 'dropshipper', 'importer'])
      .notNullable()
      .defaultTo('wholesaler');
    table.jsonb('address');
    table.jsonb('service_areas'); // Areas they deliver to
    table.decimal('minimum_order_amount', 10, 2).defaultTo(0);
    table.integer('delivery_lead_time_days'); // Average delivery time
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });

  // ✅ Products table
  await knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.integer('shop_id').unsigned().notNullable()
      .references('id').inTable('shops').onDelete('CASCADE');
    table.string('barcode').notNullable(); // having a globally unique barcode across all products can cause issues when multiple shops sell the same product
    table.string('name').notNullable();
    table.text('description');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.string('category').notNullable();
    table.string('brand').notNullable();
    table.string('unit').notNullable();
    table.string('unit_value').notNullable();
    table.string('image').nullable();
    table.string('hsn_sac_code').nullable(); // ✅ HSN/SAC code
    table.string('default_tax_category').nullable(); // ✅ Tax category
    table.timestamps(true, true);
  });
  // Purchase Orders
  await knex.schema.createTable('purchase_orders', (table) => {
    table.increments('id').primary();
    table.integer('shop_id').unsigned().notNullable()
      .references('id').inTable('shops').onDelete('CASCADE');
    table.integer('supplier_id').unsigned().notNullable()
      .references('id').inTable('suppliers').onDelete('CASCADE');
    table.enu('status', ['draft', 'ordered', 'in_transit', 'received', 'cancelled'])
      .defaultTo('draft');
    table.integer('distributor_id').unsigned().references('id').inTable('distributors');
    // add order_date
    table.date('order_date').notNullable().defaultTo(knex.fn.now());
    table.date('expected_date').nullable();
    table.decimal('total_amount', 15, 2);
    table.text('notes');
    table.timestamps(true, true);
  });
  // Purchase Order Items
  // Enhanced purchase order items
  await knex.schema.createTable('purchase_order_items', (table) => {
    table.increments('id').primary();
    table.integer('purchase_order_id').unsigned().notNullable()
      .references('id').inTable('purchase_orders').onDelete('CASCADE');
    table.integer('product_id').unsigned().notNullable()
      .references('id').inTable('products').onDelete('RESTRICT');
    table.string('product_name').notNullable();
    table.string('hsn_sac_code').nullable();
    table.decimal('quantity', 10, 2).notNullable();
    table.decimal('unit_price', 10, 2).notNullable();
    table.decimal('discount_per_item', 15, 2).defaultTo(0);
    table.decimal('taxable_value', 15, 2).notNullable();
    table.decimal('gst_rate_percentage', 5, 2).notNullable();
    table.decimal('cgst_amount_per_item', 15, 2).defaultTo(0);
    table.decimal('sgst_amount_per_item', 15, 2).defaultTo(0);
    table.decimal('igst_amount_per_item', 15, 2).defaultTo(0);
    table.decimal('cess_amount_per_item', 15, 2).defaultTo(0);
    table.decimal('total_item_amount', 15, 2).notNullable();
    table.timestamps(true, true);
  });
  // Customers table
  await knex.schema.createTable('customers', (table) => {
    table.increments('id').primary();
    table.integer('shop_id').unsigned().notNullable()
      .references('id').inTable('shops').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('email');
    table.string('phone');
    table.string('gstin').nullable(); // ✅ Customer GSTIN
    table.jsonb('address');
    table.timestamps(true, true);
  });


  // Audit logs table
  await knex.schema.createTable('audit_logs', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
    table.integer('shop_id').unsigned().nullable().references('id').inTable('shops').onDelete('SET NULL');
    table.string('action_type').notNullable();
    table.string('table_name').nullable();
    table.integer('record_id').nullable();
    table.jsonb('old_value').nullable();
    table.jsonb('new_value').nullable();
    table.jsonb('ip_address').nullable();
    table.timestamp('action_timestamp').defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
  // Shipping Methods
  await knex.schema.createTable('shipping_methods', (table) => {
    table.increments('id').primary();
    table.integer('company_id').unsigned().notNullable()
      .references('id').inTable('companies').onDelete('CASCADE');
    table.string('name').notNullable();
    table.decimal('cost', 10, 2).notNullable();
    table.jsonb('service_details');
  });
  // ✅ Orders
  await knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table.integer('shop_id').unsigned().notNullable()
      .references('id').inTable('shops').onDelete('CASCADE');
    table.integer('customer_id').unsigned()
      .references('id').inTable('customers').onDelete('SET NULL');
    table.jsonb('shipping_address');
    table.string('po_number');
    table.string('customer_name');
    table.decimal('total_amount', 15, 2).notNullable();
    table.string('status').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.enum('type', ['sales', 'purchase']).notNullable().defaultTo('sales');
    table.jsonb('delivery_address');
    table.decimal('delivery_lat', 10, 6);
    table.decimal('delivery_lng', 10, 6);
    table.string('delivery_instructions');
    table.timestamp('preferred_delivery_time');
    table.enu('delivery_status', ['pending', 'dispatched', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'returned'])
      .defaultTo('pending');
  });

  // ✅ Order Items
  await knex.schema.createTable('order_items', (table) => {
    table.increments('id').primary();
    table.integer('order_id').unsigned().notNullable()
      .references('id').inTable('orders').onDelete('CASCADE');
    table.integer('product_id').unsigned().notNullable()
      .references('id').inTable('products').onDelete('CASCADE');
    table.integer('quantity').notNullable();
    table.decimal('price', 15, 2).notNullable();
    table.integer('shop_id').unsigned().notNullable()
      .references('id').inTable('shops').onDelete('CASCADE');
    table.enum('type', ['sales', 'purchase']).notNullable().defaultTo('sales');
  });

  // Integration Devices
  await knex.schema.createTable('integration_devices', (table) => {
    table.increments('id').primary();
    table.integer('shop_id').unsigned().notNullable()
      .references('id').inTable('shops').onDelete('CASCADE');
    table.enu('type', ['pos', 'scale', 'payment_terminal']).notNullable();
    table.string('name').notNullable();
    table.jsonb('configuration').notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });
  // Notifications (Email/SMS)
  await knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary();
    table.integer('shop_id').unsigned().notNullable()
      .references('id').inTable('shops').onDelete('CASCADE');
    table.enu('type', ['email', 'sms', 'push']).notNullable();
    table.text('content').notNullable();
    table.jsonb('recipients').notNullable();
    table.enu('status', ['queued', 'sent', 'failed']).defaultTo('queued');
    table.timestamp('sent_at');
    table.timestamps(true, true);
  });
  await knex.schema.createTable('notification_statuses', (table) => {
    table.increments('id').primary()
    table.integer('notification_id').unsigned().references('id').inTable('notifications')
    table.integer('shop_id').unsigned().references('id').inTable('shops')
    table.boolean('read_status').defaultTo(false)
    table.timestamps(true, true)
    table.unique(['notification_id', 'shop_id'])
  })
  // ✅ Shop-Products junction table ( in shop_id , sku consider Adding unique constraint)
  await knex.schema.createTable('shop_products', (table) => {
    table.increments('id').primary();
    table.string('sku').notNullable();
    table.string('barcode').notNullable();
    table.integer('shop_id').unsigned().notNullable()
      .references('id').inTable('shops').onDelete('CASCADE');
    table.integer('product_id').unsigned().notNullable()
      .references('id').inTable('products').onDelete('CASCADE');
    table.decimal('retail_price', 10, 2).notNullable();
    table.decimal('wholesale_price', 10, 2).notNullable();
    table.decimal('purchase_price', 10, 2).notNullable();
    table.decimal('stock', 10, 2).notNullable().defaultTo(0);
    // ✅ Composite unique constraints
    table.unique(['shop_id', 'sku']);
    table.unique(['shop_id', 'barcode']); // resolved getting constraint violation while another user create same sku or barcode for her shop
    table.enu('status', ['active', 'out_of_stock', 'discontinued']).defaultTo('active');
    table.string('barcode_image');
    table.jsonb('barcode_settings');
    table.decimal('reorder_threshold', 10, 2);
    table.timestamps(true, true);
  });

  // Delivery routes table
  await knex.schema.createTable('delivery_routes', (table) => {
    table.increments('id').primary();
    table.integer('company_id').unsigned().notNullable()
      .references('id').inTable('companies').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('description');
    table.jsonb('route_path'); // GeoJSON or coordinates of the route
    table.integer('driver_id').unsigned().references('id').inTable('users');
    table.decimal('estimated_duration_minutes', 10, 2);
    table.decimal('distance_km', 10, 2);
    table.timestamps(true, true);
  });

  // Delivery vehicles table
  await knex.schema.createTable('delivery_vehicles', (table) => {
    table.increments('id').primary();
    table.integer('company_id').unsigned().notNullable()
      .references('id').inTable('companies').onDelete('CASCADE');
    table.string('registration_number').notNullable();
    table.string('vehicle_type').notNullable(); // truck, van, bike, etc.
    table.decimal('capacity_kg', 10, 2);
    table.decimal('current_lat', 10, 6);
    table.decimal('current_lng', 10, 6);
    table.enu('status', ['available', 'in_transit', 'maintenance', 'offline'])
      .defaultTo('available');
    table.integer('driver_id').unsigned().references('id').inTable('users');
    table.timestamps(true, true);
  });


  // Enhanced shipments table for delivery tracking
  await knex.schema.createTable('shipments', (table) => {
    table.increments('id').primary();
    table.integer('order_id').unsigned().notNullable()
      .references('id').inTable('orders').onDelete('CASCADE');
    table.integer('distributor_id').unsigned().references('id').inTable('distributors');
    table.integer('vehicle_id').unsigned().references('id').inTable('delivery_vehicles');
    table.integer('route_id').unsigned().references('id').inTable('delivery_routes');
    table.string('tracking_number');
    table.enu('status', ['preparing', 'pending', 'dispatched', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'returned'])
      .defaultTo('pending');
    table.timestamp('dispatched_at');
    table.timestamp('in_transit_at');
    table.timestamp('out_for_delivery_at');
    table.timestamp('delivered_at');
    table.timestamp('cancelled_at');
    table.jsonb('tracking_history'); // Array of status updates with timestamps
    table.decimal('current_lat', 10, 6);
    table.decimal('current_lng', 10, 6);
    table.decimal('estimated_delivery_time_minutes', 10, 2);
    table.integer('method_id').unsigned().notNullable()
      .references('id').inTable('shipping_methods').onDelete('CASCADE');
    table.timestamp('shipped_at');
    table.timestamps(true, true);
  });


  await knex.schema.createTable('sales', table => {
    table.increments('id').primary();
    table.integer('shop_id').unsigned().notNullable().references('id').inTable('shops').onDelete('RESTRICT');
    table.integer('customer_id').unsigned().nullable().references('id').inTable('customers').onDelete('SET NULL');
    table.string('customer_gstin').nullable(); // ✅ Transaction GSTIN
    table.string('invoice_number').notNullable().unique(); // ✅ Invoice number
    table.decimal('discount_amount', 10, 2).notNullable().defaultTo(0.00);
    table.jsonb('items_sold');
    table.integer('shipment_id').unsigned().references('id').inTable('shipments');
    table.enu('document_type', ['invoice', 'bill_of_supply', 'credit_note', 'debit_note']).notNullable().defaultTo('invoice');
    table.decimal('total_taxable_value', 15, 2).notNullable();
    table.decimal('total_cgst_amount', 15, 2).defaultTo(0);
    table.decimal('total_sgst_amount', 15, 2).defaultTo(0);
    table.decimal('total_igst_amount', 15, 2).defaultTo(0);
    table.decimal('total_cess_amount', 15, 2).defaultTo(0);
    table.decimal('total_discount_amount', 15, 2).defaultTo(0);
    table.decimal('total_amount', 15, 2).notNullable();
    table.enu('supply_type', ['intra_state', 'inter_state', 'export', 'sez_supply']).notNullable();
    table.boolean('is_b2b').defaultTo(false);
    table.boolean('is_reverse_charge').defaultTo(false);
    table.jsonb('payment_details');
    table.timestamp('sale_date').defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });

  // Sale items table
  await knex.schema.createTable('sale_items', (table) => {
    table.increments('id').primary();
    table.integer('sale_id').unsigned().notNullable().references('id').inTable('sales').onDelete('CASCADE');
    table.integer('product_id').unsigned().notNullable().references('id').inTable('products').onDelete('RESTRICT');
    table.string('product_name').notNullable();
    table.string('hsn_sac_code').nullable();
    table.decimal('quantity', 10, 3).notNullable();
    table.decimal('unit_price', 10, 2).notNullable();
    table.decimal('discount_per_item', 15, 2).defaultTo(0);
    table.decimal('taxable_value', 15, 2).notNullable();
    table.decimal('gst_rate_percentage', 5, 2).notNullable();
    table.decimal('cgst_amount_per_item', 15, 2).defaultTo(0);
    table.decimal('sgst_amount_per_item', 15, 2).defaultTo(0);
    table.decimal('igst_amount_per_item', 15, 2).defaultTo(0);
    table.decimal('cess_amount_per_item', 15, 2).defaultTo(0);
    table.decimal('total_item_amount', 15, 2).notNullable();
    table.timestamps(true, true);
  });

  // Delivery proofs table
  await knex.schema.createTable('delivery_proofs', (table) => {
    table.increments('id').primary();
    table.integer('shipment_id').unsigned().notNullable()
      .references('id').inTable('shipments').onDelete('CASCADE');
    table.string('signature_image'); // Customer signature
    table.string('photo_proof'); // Delivery photo proof
    table.string('otp_verification'); // OTP for verification
    table.timestamp('verified_at');
    table.timestamps(true, true);
  });

  // Transit hubs table
  await knex.schema.createTable('transit_hubs', (table) => {
    table.increments('id').primary();
    table.integer('company_id').unsigned().notNullable()
      .references('id').inTable('companies').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('code').notNullable(); // Short code for the hub
    table.decimal('lat', 10, 6).notNullable();
    table.decimal('lng', 10, 6).notNullable();
    table.jsonb('address').notNullable();
    table.enu('type', ['distribution_center', 'warehouse', 'sorting_facility', 'last_mile'])
      .defaultTo('distribution_center');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });

  // Shipment transit history table
  await knex.schema.createTable('shipment_transit_history', (table) => {
    table.increments('id').primary();
    table.integer('shipment_id').unsigned().notNullable()
      .references('id').inTable('shipments').onDelete('CASCADE');
    table.integer('transit_hub_id').unsigned().references('id').inTable('transit_hubs');
    table.string('location_name');
    table.decimal('lat', 10, 6);
    table.decimal('lng', 10, 6);
    table.string('status'); // arrived, departed, etc.
    table.timestamp('recorded_at');
    table.timestamps(true, true);
  });


  // Report Snapshots
  await knex.schema.createTable('report_snapshots', (table) => {
    table.increments('id').primary();
    table.integer('company_id').unsigned().notNullable()
      .references('id').inTable('companies').onDelete('CASCADE');
    table.string('report_type').notNullable();
    table.jsonb('data').notNullable();
    table.timestamp('period_start').notNullable();
    table.timestamp('period_end').notNullable();
    table.timestamps(true, true);
  });
  // Employee profiles
  await knex.schema.createTable('employee_profiles', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().unique().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.integer('managed_by').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });

  // Shop permissions
  await knex.schema.createTable('shop_permissions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.integer('shop_id').unsigned().notNullable()
      .references('id').inTable('shops').onDelete('CASCADE');
    table.enu('role', ['manager', 'cashier', 'inventory_staff'])
      .notNullable();
    table.specificType('permissions', 'permission_type[]').defaultTo('{}');
    table.unique(['user_id', 'shop_id']);
    table.timestamps(true, true);
  });

  // Price history
  await knex.schema.createTable('price_history', (table) => {
    table.increments('id').primary();
    table.integer('product_id').unsigned().notNullable()
      .references('id').inTable('products').onDelete('CASCADE');
    table.integer('shop_id').unsigned().nullable()
      .references('id').inTable('shops').onDelete('CASCADE');
    table.enu('price_type', ['retail', 'wholesale', 'purchase'])
      .notNullable();
    table.decimal('old_price', 10, 2).notNullable();
    table.decimal('new_price', 10, 2).notNullable();
    table.integer('changed_by').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  });

  // Promotions
  await knex.schema.createTable('promotions', (table) => {
    table.increments('id').primary();
    table.integer('shop_id').unsigned().notNullable()
      .references('id').inTable('shops').onDelete('CASCADE');
    table.text('offer_text').notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.decimal('min_purchase_amount', 10, 2);
    table.decimal('discount_percentage', 5, 2);
    table.timestamps(true, true);
  });

  // Indexes
  await knex.schema.alterTable('shops', (table) => {
    table.index('owner_id');
  });
  await knex.schema.alterTable('shop_products', (table) => {
    table.index('shop_id');
    table.index('product_id');
  });
  await knex.schema.alterTable('price_history', (table) => {
    table.index(['product_id', 'price_type']);
  });
}

export async function down(knex) {
  // 1. Drop dependent foreign keys first
  await knex.schema.alterTable('orders', (table) => {
    table.dropForeign('customer_id');
    table.dropForeign('shop_id');
  });

  await knex.schema.alterTable('scale_configurations', (table) => {
    table.dropForeign('shop_id');
  });

  await knex.schema.alterTable('sales', (table) => {
    table.dropForeign('shipment_id');
  });

  await knex.schema.alterTable('shipment_transit_history', (table) => {
    table.dropForeign('shipment_id');
  });

  await knex.schema.alterTable('delivery_proofs', (table) => {
    table.dropForeign('shipment_id');
  });

  await knex.schema.alterTable('shipments', (table) => {
    table.dropForeign('vehicle_id');
    table.dropForeign('route_id');
    table.dropForeign('method_id');
  });

  await knex.schema.alterTable('notification_statuses', (table) => {
    table.dropForeign('notification_id');
  });
  //2 Drop in reverse dependency order
  await knex.schema.dropTableIfExists('notification_statuses');
  await knex.schema.dropTableIfExists('notifications');
  await knex.schema.dropTableIfExists('integration_devices');
  await knex.schema.dropTableIfExists('shipment_transit_history');
  await knex.schema.dropTableIfExists('delivery_proofs');
  await knex.schema.dropTableIfExists('sale_items');
  await knex.schema.dropTableIfExists('sales');
  await knex.schema.dropTableIfExists('order_items');
  await knex.schema.dropTableIfExists('shop_products');
  await knex.schema.dropTableIfExists('price_history');
  await knex.schema.dropTableIfExists('shop_permissions');
  await knex.schema.dropTableIfExists('promotions');
  await knex.schema.dropTableIfExists('audit_logs');
  await knex.schema.dropTableIfExists('purchase_order_items');
  await knex.schema.dropTableIfExists('purchase_orders');
  await knex.schema.dropTableIfExists('customers');
  await knex.schema.dropTableIfExists('suppliers');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('shipments');
  await knex.schema.dropTableIfExists('distributors');      // 👈 depends on companies
  await knex.schema.dropTableIfExists('delivery_vehicles'); // 👈 depends on companies
  await knex.schema.dropTableIfExists('delivery_routes');   // 👈 depends on companies
  await knex.schema.dropTableIfExists('shipping_methods');  // 👈 depends on companies
  await knex.schema.dropTableIfExists('transit_hubs');      // 👈 depends on companies
  await knex.schema.dropTableIfExists('report_snapshots');  // 👈 depends on companies
  await knex.schema.dropTableIfExists('employee_profiles');
  await knex.schema.dropTableIfExists('shops');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('companies');         // 👈 now safe
  await knex.schema.dropTableIfExists('scale_configurations');
  await knex.schema.dropTableIfExists('orders');
  // 4. Drop custom enum types
  await knex.raw('DROP TYPE IF EXISTS scale_protocols');
  await knex.raw('DROP TYPE IF EXISTS permission_type');
  await knex.raw('DROP TYPE IF EXISTS plan_type');
};






// 🧑 Users
// users ↔ shops:
// shops.owner_id → users.id
// One-to-many: A user can own multiple shops.
// users ↔ employee_profiles:
// employee_profiles.user_id → users.id
// One-to-one: A user can have one employee profile.
// users ↔ employee_profiles (as manager):
// employee_profiles.managed_by → users.id
// One-to-many: A user (typically an owner/manager) can manage many employees.
// users ↔ shop_permissions
// shop_permissions.user_id → users.id
// Many-to-many via shop_permissions: a user can have access to multiple shops with specific roles.
// users ↔ price_history:
// price_history.changed_by → users.id
// One-to-many: A user can change prices for many products.

// 🏬 Shops
// shops ↔ users:
// shops.owner_id → users.id
// (Already covered above)
// shops ↔ shop_products:
// shop_products.shop_id → shops.id
// One-to-many: A shop can have many product entries (with prices, stock, SKU/barcode).
// shops ↔ shop_permissions:
// shop_permissions.shop_id → shops.id
// Many-to-many via shop_permissions: a shop can have many users with roles.
// shops ↔ price_history:
// price_history.shop_id → shops.id
// Optional one-to-many: Price history can be shop-specific or global.
// shops ↔ promotions:
// promotions.shop_id → shops.id
// One-to-many: A shop can have many promotions.
// shops ↔ orders:
// orders.shop_id → shops.id
// One-to-many: A shop can have many orders.
// shops ↔ order_items:
// order_items.shop_id → shops.id
// One-to-many: Order items are tied to a specific shop.

// 📦 Products
// products ↔ shop_products:
// shop_products.product_id → products.id
// Many-to-many: A product can be sold at multiple shops (with different pricing/stock).
// products ↔ price_history:
// price_history.product_id → products.id
// One-to-many: Track price changes over time per product.
// products ↔ order_items:
// order_items.product_id → products.id
// One-to-many: A product can appear in many order items.
// 🧾 Orders & Itms
// orders ↔ shops:
// orders.shop_id → shops.id
// (Already covered above)
// orders ↔ order_items:
// order_items.order_id → orders.id
// One-to-many: Each order has many order items.

// 🛒 Shop-Products (junction table)
// shop_products ↔ shops and products
// Many-to-many relationship: Connects shops and products with unique SKU/barcode/pricing per shop.

// Summary Diagram (text format)
// users ───< shops
//       └──< employee_profiles >── users (as manager)
//       └──< shop_permissions >── shops
//       └──< price_history
// shops ───< shop_products >── products
//      └──< shop_permissions
//      └──< promotions
//      └──< orders ───< order_items >── products
// products ───< price_history

// Key Enhancements made on commit 20/05/25
// Multi-Company Architecture
// Added companies table as top-level organization
// All shop/resources now company-scoped
// Complete Purchasing Workflow
// suppliers + purchase_orders + purchase items
// Status tracking for order lifecycle
// Advanced Shipping
// Multiple shipping methods with cost tracking
// Detailed shipment status history
// Customer Management
// Dedicated customers table with address storage
// Linked to orders for customer history
// Device Integrations
// POS/Scale configuration storage
// Active/inactive device management

// Feature Gating

// Company-level plan with enabled features
// Easy tier-based access control
// Notifications System
// Unified email/SMS/push notification tracking
// Delivery status monitoring
// Reporting Improvements
// Pre-generated report snapshots
// Historical data preservation
// Barcode Enhancements
// Storage of generated barcode images
// Custom barcode settings per product
// Usage Notes:
// Multi-Tenant Queries
// Always filter by company_id for data isolation
// Inventory Replenishment
// Use reorder_threshold for stock alerts
// Shipping Cost Calculation
// Calculate shipping costs based on method + order details
// Feature Enablement
// Check company.enabled_features array for feature flags
// This schema supports:
// Multiple companies/tenants
// Full procurement lifecycle
// Complex shipping scenarios
// Customer relationship management
// Tiered feature access
// Historical data analysis
// POS/device integrations

// ✅ Correct Order (Simplified Dependency Tree)
// companies
// users
// shops
// products
// customers
// suppliers
// shipping_methods
// orders ✅ (before shipments)
// shipments ✅
// purchase_orders
// purchase_order_items
// sales
// order_items
// promotions
// scale_configurations
// integration_devices
// notifications
// shop_products
// employee_profiles
// shop_permissions
// price_history
// report_snapshots