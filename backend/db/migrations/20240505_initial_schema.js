// migrations/YYYYMMDDHHMMSS_initial_schema.js 
// migrations/20250905_create_users_table.js

export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('phone').nullable();
    table.string('avatar_url').nullable(); // profile picture
    table.string('license_file').nullable(); // optional file
    table.boolean('terms_accepted').defaultTo(false);

    // Roles for Car Wash app
    table.enu('role', ['customer', 'staff', 'admin' , 'owner'])
      .notNullable()
      .defaultTo('customer');

    // Dashboard-specific settings
    table.jsonb('settings').defaultTo('{}');

    // Progress / gamification for students
    table.integer('streaks').defaultTo(0);
    table.jsonb('badges').defaultTo('[]'); // array of earned badges
    table.jsonb('analytics').defaultTo('{}'); // attendance, marks, engagement

    table.timestamps(true, true); // created_at and updated_at
  });

}

export async function down(knex) {
  await knex.schema.dropTableIfExists('users');
}





