// migrations/005_create_promotions.js

export async function up(knex) {
    return knex.schema.createTable('promotions', table => {
      table.increments('id').primary();
      table.integer('shop_id').unsigned().notNullable()
        .references('id').inTable('shops').onDelete('CASCADE');
      table.text('offer_text').notNullable();
      table.date('start_date').notNullable();
      table.date('end_date').notNullable();
      table.decimal('min_purchase_amount', 10, 2);
      table.decimal('discount_percentage', 5, 2);
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
    })
    .then(() =>
      // Add a CHECK constraint for end_date >= start_date
      knex.raw(
        `ALTER TABLE promotions
         ADD CONSTRAINT promotions_end_after_start
         CHECK (end_date >= start_date)`
      )
    );
  }
  
  export async function down(knex) {
    return knex.schema.dropTableIfExists('promotions');
  }
  