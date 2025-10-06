// seeds/initial_seeds.js
//Uses proper bcrypt hashed passwords (all users have password "password123")
exports.seed = async function (knex) {
  // Deletes ALL existing entries in reverse order of dependency
  await knex('promotions').del();
  await knex('price_history').del();
  await knex('shop_permissions').del();
  await knex('employee_profiles').del();
  await knex('shop_products').del();
  await knex('products').del();
  await knex('shops').del();
  await knex('users').del();

  // Insert users
  const insertedUsers = await knex('users').insert([
    {
      name: 'John Doe',
      email: 'owner@example.com',
      password_hash: '$2a$10$dFJVpyPbH0p8pcl/0hD8EeNf8qG.8lzM7r9NcB5Vj2uKk1QYzLbW6',
      phone: '+1234567890',
      role: 'owner',
      terms_accepted: true,
      license_file: 'licenses/john_license.pdf'
    },
    {
      name: 'Jane Smith',
      email: 'employee@example.com',
      password_hash: '$2a$10$dFJVpyPbH0p8pcl/0hD8EeNf8qG.8lzM7r9NcB5Vj2uKk1QYzLbW6',
      phone: '+1987654321',
      role: 'employee',
      terms_accepted: true
    },
    {
      name: 'Alice Customer',
      email: 'customer@example.com',
      password_hash: '$2a$10$dFJVpyPbH0p8pcl/0hD8EeNf8qG.8lzM7r9NcB5Vj2uKk1QYzLbW6',
      phone: '+1555123456',
      role: 'customer',
      terms_accepted: true
    }
  ]).returning('id');

  const userIds = insertedUsers.map(u => u.id);

  // Insert shop
  const insertedShop = await knex('shops').insert({
    name: 'Doe Enterprises',
    location: '123 Main Street, Commerce City',
    phone: '+18005551234',
    email: 'contact@doe-enterprises.com',
    owner_id: userIds[0],
    status: 'active'
  }).returning('id');

  const shopId = insertedShop[0].id;

  // Insert product
  const insertedProduct = await knex('products').insert({
    name: 'Arabica Coffee Beans',
    description: 'Premium grade arabica coffee beans from Colombia',
    category: 'Beverages',
    brand: 'CoffeeMaster',
    unit: 'bag',
    unit_value: '1kg',
    image: 'products/coffee.jpg',
    is_active: true
  }).returning('id');

  const productId = insertedProduct[0].id;

  // Insert shop product
  await knex('shop_products').insert({
    sku: 'CM-1001',
    barcode: '123456789012',
    shop_id: shopId,
    product_id: productId,
    retail_price: 24.99,
    wholesale_price: 19.99,
    purchase_price: 14.50,
    stock: 150
  });

  // Insert employee profile
  await knex('employee_profiles').insert({
    user_id: userIds[1],
    managed_by: userIds[0],
    is_active: true
  });

  // Insert shop permissions
  await knex('shop_permissions').insert({
    user_id: userIds[1],
    shop_id: shopId,
    role: 'cashier',
    permissions: ['process_sales', 'handle_customers', 'view_inventory']
  });

  // Insert price history
  await knex('price_history').insert({
    product_id: productId,
    shop_id: shopId,
    price_type: 'retail',
    old_price: 0.00,
    new_price: 24.99,
    changed_by: userIds[0]
  });

  // Insert promotion
  await knex('promotions').insert({
    shop_id: shopId,
    offer_text: 'Grand Opening Sale! 20% off all coffee products',
    start_date: '2024-03-01',
    end_date: '2024-03-15',
    min_purchase_amount: 50.00,
    discount_percentage: 20.00
  });
};
