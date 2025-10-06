export async function up(knex) {
  return knex.schema.createTable('shops', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('location').notNullable();
    table.string('phone').notNullable();
    table.string('email').notNullable();
    table.enu('status', ['active', 'inactive', 'needs-update']).defaultTo('active');
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE'); // User should have role = 'owner'
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('shops');
}
