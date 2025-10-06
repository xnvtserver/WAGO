export async function up(knex) {
  return knex.schema.createTable('shop_prices', (table) => {
    table.increments('id').primary();
    table.integer('product_id').references('id').inTable('products').notNullable();
    table.integer('shop_id').references('id').inTable('shops').notNullable();
    table.decimal('retail_price', 10, 2).notNullable();
    table.decimal('wholesale_price', 10, 2).notNullable();
    table.timestamp('last_updated').defaultTo(knex.fn.now());
    table.unique(['product_id', 'shop_id']);
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('shop_prices');
}