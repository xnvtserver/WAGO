Perfect 👍 Since you’re using **Knex.js** with either PostgreSQL or MySQL, I’ll generate the **full migration files** for the car/bike washing & servicing marketplace backend we structured earlier.

We’ll need migrations for:

1. `users` → customers & providers
2. `shops` → service provider’s shops
3. `services` → shop services (wash, oil change, etc.)
4. `bookings` → customer bookings linked to shops & services

---

## 1. `users` migration

```js
// migrations/20250925100000_create_users.js
export async function up(knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.enu("role", ["customer", "provider"]).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("users");
}
```

---

## 2. `shops` migration

```js
// migrations/20250925101000_create_shops.js
export async function up(knex) {
  await knex.schema.createTable("shops", (table) => {
    table.increments("id").primary();
    table.integer("provider_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    table.string("name").notNullable();
    table.text("description");
    table.string("address").notNullable();
    table.decimal("latitude", 10, 7).notNullable();
    table.decimal("longitude", 10, 7).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("shops");
}
```

---

## 3. `services` migration

```js
// migrations/20250925102000_create_services.js
export async function up(knex) {
  await knex.schema.createTable("services", (table) => {
    table.increments("id").primary();
    table.integer("shop_id").unsigned().references("id").inTable("shops").onDelete("CASCADE");
    table.string("name").notNullable();
    table.text("description");
    table.decimal("price", 10, 2).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("services");
}
```

---

## 4. `bookings` migration

```js
// migrations/20250925103000_create_bookings.js
export async function up(knex) {
  await knex.schema.createTable("bookings", (table) => {
    table.increments("id").primary();
    table.integer("customer_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    table.integer("shop_id").unsigned().references("id").inTable("shops").onDelete("CASCADE");
    table.integer("service_id").unsigned().references("id").inTable("services").onDelete("CASCADE");
    table.timestamp("booking_date").notNullable();
    table.enu("status", ["pending", "confirmed", "completed", "cancelled"]).defaultTo("pending");
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("bookings");
}
```

---

✅ With these four migrations:

* **users** store customers & providers.
* **shops** belong to providers.
* **services** belong to shops.
* **bookings** link customers → services → shops.

---

Do you also want me to generate a **`seeds/` directory with sample dummy data** (one customer, one provider, one shop, some services, and a booking) so you can test the API right away?
