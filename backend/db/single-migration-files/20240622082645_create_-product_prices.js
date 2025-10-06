export async function up(knex) {
  return knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description');
    table.boolean('is_active').notNullable().defaultTo(true); 
    table.decimal('retail_price', 10, 2);
    table.decimal('wholesale_price', 10, 2);
    table.decimal('purchase_price', 10, 2);
    table.string('sku').unique().notNullable();
    table.string('barcode').unique().notNullable();
    table.string('category').notNullable();
    table.string('brand').notNullable();
    table.string('unit').notNullable();
    table.string('unit_value').notNullable();
    table.integer('stock').notNullable().defaultTo(0);
    table.integer('shop_id').unsigned().notNullable()
      .references('id').inTable('shops').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('products');
}
