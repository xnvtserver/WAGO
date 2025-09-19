// migrations/YYYYMMDDHHMMSS_initial_schema.js 
 // Users table (no shop references) (now company-linked Users table)
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
    table.enu('role', ['customer', 'staff', 'admin'])
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

  // Optional: create a table for courses
  await knex.schema.createTable('courses', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description').nullable();
    table.integer('teacher_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.jsonb('students').defaultTo('[]'); // array of student IDs
    table.jsonb('schedule').defaultTo('{}'); // class timings, deadlines
    table.timestamps(true, true);
  });

  // Optional: assignments table
  await knex.schema.createTable('assignments', (table) => {
    table.increments('id').primary();
    table.integer('course_id').unsigned().references('id').inTable('courses').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description').nullable();
    table.date('due_date').nullable();
    table.jsonb('submissions').defaultTo('{}'); // {student_id: submission_status}
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('assignments');
  await knex.schema.dropTableIfExists('courses');
  await knex.schema.dropTableIfExists('users');
}





