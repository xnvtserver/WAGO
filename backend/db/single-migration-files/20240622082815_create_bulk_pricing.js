export async function up(knex) {
  return knex.schema.createTable('bulk_pricing', (table) => {
    table.increments('id').primary();
    table.integer('product_id').references('id').inTable('products').notNullable();
    table.integer('min_quantity').notNullable();
    table.integer('max_quantity').notNullable();
    table.decimal('retail_price', 10, 2).notNullable();
    table.decimal('wholesale_price', 10, 2).notNullable();
    table.boolean('active').defaultTo(true);
    table.check('?? < ??', ['min_quantity', 'max_quantity']);
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('bulk_pricing');
}