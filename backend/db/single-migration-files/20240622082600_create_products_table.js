export async function up(knex) {
  return knex.schema.createTable('product_prices', (table) => {
    table.increments('id').primary();
    table.integer('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.decimal('purchase_price', 15, 2).notNullable();
    table.decimal('retail_price', 15, 2).notNullable();
    table.decimal('wholesale_price', 15, 2).notNullable();
    table.enum('price_policy', ['fixed', 'percentage', 'tiered']).defaultTo('fixed');
    table.boolean('bulk_pricing_enabled').defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('product_prices');
}