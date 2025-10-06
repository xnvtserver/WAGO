export async function up(knex) {
  return knex.schema.createTable('price_history', (table) => {
    table.increments('id').primary();
    table.integer('product_id').references('id').inTable('products').notNullable();
    table.integer('shop_id').references('id').inTable('shops').nullable();
    table.enu('price_type', ['base', 'retail', 'wholesale', 'purchase']).notNullable();
    table.jsonb('old_price').notNullable();
    table.jsonb('new_price').notNullable();
    table.string('changed_by').notNullable();
    table.timestamps(true, true);
    table.index(['product_id', 'price_type']);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('price_history');
}