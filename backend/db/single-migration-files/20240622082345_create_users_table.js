export async function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('shop_name'); // Optional: only relevant if role is 'owner'
    table.string('owner_name'); // Optional: same here
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('phone').notNullable();
    table.string('license_file');
    table.boolean('terms_accepted').defaultTo(false);
    table.enu('role', ['owner', 'employee', 'customer']).notNullable().defaultTo('customer');
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('users');
}
