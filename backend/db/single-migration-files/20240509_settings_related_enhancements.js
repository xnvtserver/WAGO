export async function up(knex) {
  // Create custom enum for permissions
await knex.raw(`
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'permission_type') THEN
      CREATE TYPE permission_type AS ENUM (
        'view_dashboard',
        'manage_inventory',
        'process_sales',
        'view_reports',
        'manage_pricing',
        'handle_customers'
      );
    END IF;
  END$$;
`);

  // Users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('phone').notNullable();
    table.string('license_file');
    table.boolean('terms_accepted').defaultTo(false);
    table.enu('role', ['admin', 'manager', 'staff']).notNullable().defaultTo('staff');
    table.timestamps(true, true);
  });

  // Shops table
  await knex.schema.createTable('shops', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('address');
    table.string('phone').notNullable();
    table.string('email').notNullable();
    table.string('website');
    table.text('business_hours');
    table.enu('status', ['active', 'inactive', 'needs-update']).defaultTo('active');
    table.integer('owner_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  });

  // Products table
  await knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.string('sku').unique().notNullable();
    table.string('barcode').unique().notNullable();
    table.string('category').notNullable();
    table.string('brand').notNullable();
    table.string('unit').notNullable();
    table.string('unit_value').notNullable();
    table.timestamps(true, true);
  });

  // Shop-Products junction
  await knex.schema.createTable('shop_products', (table) => {
    table.increments('id').primary();
    table.integer('shop_id').unsigned().notNullable()
      .references('id').inTable('shops').onDelete('CASCADE');
    table.integer('product_id').unsigned().notNullable()
      .references('id').inTable('products').onDelete('CASCADE');
    table.decimal('retail_price', 10, 2).notNullable();
    table.decimal('wholesale_price', 10, 2).notNullable();
    table.decimal('purchase_price', 10, 2).notNullable();
    table.integer('stock').notNullable().defaultTo(0);
    table.unique(['shop_id', 'product_id']);
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
    table.enu('role', ['manager', 'cashier', 'inventory_staff']).notNullable();
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
    table.enu('price_type', ['retail', 'wholesale', 'purchase']).notNullable();
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

  // Tax rates
  await knex.schema.createTable('tax_rates', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.float('rate').notNullable();
    table.enu('type', ['sales', 'local', 'vat', 'gst']).notNullable();
    table.string('region').notNullable();
    table.integer('shop_id').unsigned().notNullable()
      .references('id').inTable('shops').onDelete('CASCADE');
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
  await knex.schema.dropTableIfExists('tax_rates');
  await knex.schema.dropTableIfExists('promotions');
  await knex.schema.dropTableIfExists('price_history');
  await knex.schema.dropTableIfExists('shop_permissions');
  await knex.schema.dropTableIfExists('employee_profiles');
  await knex.schema.dropTableIfExists('shop_products');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('shops');
  await knex.schema.dropTableIfExists('users');
  await knex.raw('DROP TYPE IF EXISTS permission_type');
}
