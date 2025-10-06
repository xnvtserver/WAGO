BEGIN;

-- 1. USERS
INSERT INTO users (name, email, password_hash, phone, license_file, terms_accepted, role, created_at, updated_at) VALUES
  ('അനീഷ്',    'aneesh@example.com',    'hash1', '9847012345', NULL, true, 'owner',    NOW(), NOW()),
  ('ബിനീഷ്',    'bineesh@example.com',   'hash2', '9847012346', 'lic_2.pdf', true, 'owner',    NOW(), NOW()),
  ('ചന്ദ്രൻ',    'chandran@example.com',  'hash3', '9847012347', NULL, false,'owner',    NOW(), NOW()),
  ('ദിനേഷ്',    'dineesh@example.com',   'hash4', '9847012348', NULL, true, 'employee', NOW(), NOW()),
  ('എലിസബത്ത്','elizabeth@example.com','hash5', '9847012349', NULL, true, 'employee', NOW(), NOW()),
  ('ഫാത്തിമ',     'fathima@example.com',  'hash6', '9847012350', 'lic_6.pdf', false,'employee', NOW(), NOW()),
  ('ഗോപാൽ',     'gopal@example.com',    'hash7', '9847012351', NULL, true, 'customer', NOW(), NOW()),
  ('ഹരീഷ്',     'hareesh@example.com',  'hash8', '9847012352', NULL, true, 'customer', NOW(), NOW()),
  ('ഇന്ദ്രൺ',    'indran@example.com',   'hash9', '9847012353', NULL, false,'customer', NOW(), NOW()),
  ('ജ്യോത്സ്‌ന',  'jyotsna@example.com',  'hash10','9847012354', NULL, true, 'customer', NOW(), NOW());

-- 2. SHOPS (owner_id → users 1–3)
INSERT INTO shops (name, location, phone, email, status, owner_id, created_at, updated_at) VALUES
  ('പ്രധാന കട',     'കൊച്ചി', '4841234001','shop1@example.com','active',   1, NOW(), NOW()),
  ('ഹരിത മാർട്ട്',   'തൃശ്ശൂർ','4841234002','shop2@example.com','active',   2, NOW(), NOW()),
  ('നവകർണ്ണ',       'കോഴിക്കോട്','4841234003','shop3@example.com','inactive', 3, NOW(), NOW()),
  ('സുന്ദർ സ്റ്റോർ',  'എറണാകുളം','4841234004','shop4@example.com','active',   1, NOW(), NOW()),
  ('മലയാളു മാർട്ട്', 'പാത്തനാപുരം','4841234005','shop5@example.com','needs-update',2,NOW(),NOW()),
  ('പത്തിരി മാർട്ട്',  'വയനാട്','4841234006','shop6@example.com','active',   3, NOW(), NOW()),
  ('കേരള ഡീപാർട്ട്', 'കൊല്ലം','4841234007','shop7@example.com','active',   1, NOW(), NOW()),
  ('പുത്തൻ സ്റ്റോക്ക്',  'മലപ്പുറം','4841234008','shop8@example.com','active',   2, NOW(), NOW()),
  ('വൈഭവ ഷോപ്പ്',   'ആലപ്പുഴ','4841234009','shop9@example.com','inactive', 3, NOW(), NOW()),
  ('രത്നാ മാർട്ട്',  'കോട്ടയം','4841234010','shop10@example.com','active',  1, NOW(), NOW());

-- 3. PRODUCTS
INSERT INTO products (name, description, is_active, category, brand, unit, unit_value, image, created_at, updated_at) VALUES
  ('പപ്പടം',    'വ്യത്യസ്ത രുചിയിലുള്ള കേരള വിഭവം', true,'നാശ്താ','കൃഷ്ന', 'കപ്പ്','100ml',NULL,NOW(),NOW()),
  ('ഉപ്പുമാവ്',  'ഇളം ബുൾക്ക് ഉപ്പുമാവ്',       true,'പhrer','സുഗന്ധ', 'ബൗൾ','200ml',NULL,NOW(),NOW()),
  ('ഇഡലി',      'പൊങ്കൽ വിഭവം',             true,'നാശ്താ','ശ്രീജ','പീസ്','2',NULL,NOW(),NOW()),
  ('പരോട്ട',     'കുരുമാവ് പരotta',           true,'പാലഭക്ഷണം','വാർയ്യ','ടൈപ്പ്','1',NULL,NOW(),NOW()),
  ('ദോശ',       'ഇനിയും പരിമിതമായ ദോശ',       true,'പാലഭക്ഷണം','കുടൂർ','പീസ്','1',NULL,NOW(),NOW()),
  ('വെജിറ്റബിൾ കറി', 'പച്ചക്കറി കറി',        true,'കറി','തബസ്','ബൗൾ','150ml',NULL,NOW(),NOW()),
  ('ചപ്പാത്തി',   'ഗോധിമ പിഎ ദോശ',            true,'അപ്പം','ഭവാൻ','ടൈപ്പ്','1',NULL,NOW(),NOW()),

-- 4. SHOP_PRODUCTS (shops 1–10 × products 1–10)
INSERT INTO shop_products (sku, barcode, shop_id, product_id, retail_price, wholesale_price, purchase_price, stock, status, created_at, updated_at)
SELECT
  'SKU' || LPAD(shop_id::text,2,'0') || '-' || LPAD(product_id::text,2,'0'),
  'BC'  || LPAD(shop_id::text,2,'0') || '-' || LPAD(product_id::text,2,'0'),
  shop_id, product_id,
  ROUND(RANDOM()*500 + 50,2),
  ROUND(RANDOM()*400 + 40,2),
  ROUND(RANDOM()*300 + 30,2),
  FLOOR(RANDOM()*100),
  'active',
  NOW(), NOW()
FROM generate_series(1,10) AS shop_id
CROSS JOIN generate_series(1,10) AS product_id
LIMIT 10;

-- 5. EMPLOYEE_PROFILES (choose 3–5 as employees)
INSERT INTO employee_profiles (user_id, managed_by, is_active, created_at, updated_at) VALUES
  (4, 1, true, NOW(), NOW()),
  (5, 1, true, NOW(), NOW()),
  (6, 2, false, NOW(), NOW()),
  (4, 2, true, NOW(), NOW()),
  (5, 3, true, NOW(), NOW());

-- 6. SHOP_PERMISSIONS
INSERT INTO shop_permissions (user_id, shop_id, role, permissions, created_at, updated_at) VALUES
  (4, 1, 'manager', '{view_inventory,manage_inventory}', NOW(),NOW()),
  (5, 2, 'cashier','{process_sales}', NOW(),NOW()),
  (6, 3, 'inventory_staff','{view_inventory,view_dashboard}', NOW(),NOW()),
  (4, 4, 'manager','{view_reports,manage_pricing}', NOW(),NOW()),
  (5, 5, 'cashier','{process_sales}', NOW(),NOW()),
  (6, 6, 'inventory_staff','{view_inventory}', NOW(),NOW()),
  (4, 7, 'manager','{handle_customers}', NOW(),NOW()),
  (5, 8, 'cashier','{process_sales,view_reports}', NOW(),NOW()),
  (6, 9, 'inventory_staff','{view_inventory}', NOW(),NOW()),
  (4,10, 'manager','{view_dashboard,manage_inventory}', NOW(),NOW());

-- 7. PRICE_HISTORY
INSERT INTO price_history (product_id, shop_id, price_type, old_price, new_price, changed_by, created_at, updated_at)
SELECT
  (RANDOM()*9 + 1)::int,
  (RANDOM()*9 + 1)::int,
  (ARRAY['retail','wholesale','purchase'])[FLOOR(RANDOM()*3+1)],
  ROUND(RANDOM()*400 + 50,2),
  ROUND(RANDOM()*400 + 50,2),
  (RANDOM()*9 + 1)::int,
  NOW(), NOW()
FROM generate_series(1,10);

-- 8. PROMOTIONS
INSERT INTO promotions (shop_id, offer_text, start_date, end_date, min_purchase_amount, discount_percentage, created_at, updated_at) VALUES
  (1, 'വീണ്ടുവരും ഓഫർ', '2025-06-01','2025-06-10',200.00,10.0,NOW(),NOW()),
  (2, 'സീസണൽ ഡിസ്‌കൗണ്ട്','2025-06-05','2025-06-20',500.00,15.0,NOW(),NOW()),
  (3, 'വഴക്കക്കാല ഓഫർ','2025-07-01','2025-07-15',300.00,12.5,NOW(),NOW()),
  (4, 'നിലവിലെ ഓഫർ','2025-07-10','2025-07-25',250.00,8.0,NOW(),NOW()),
  (5, 'വീക്കം ഓഫർ','2025-08-01','2025-08-10',150.00,5.0,NOW(),NOW()),
  (6, 'വ്യത്യസ്ഥ ഓഫർ','2025-08-15','2025-08-30',100.00,7.5,NOW(),NOW()),
  (7, 'വൻ ഓഫർ','2025-09-01','2025-09-10',400.00,20.0,NOW(),NOW()),
  (8, 'കുടുംബ ഓഫർ','2025-09-15','2025-09-25',350.00,18.0,NOW(),NOW()),
  (9, 'സമ്പർക്ക ഓഫർ','2025-10-01','2025-10-15',450.00,22.0,NOW(),NOW()),
  (10,'വിലക്കുറവ് ഓഫർ','2025-10-05','2025-10-20',500.00,25.0,NOW(),NOW());

-- 9. ORDERS
INSERT INTO orders (shop_id, customer_name, total_amount, status, created_at) VALUES
  (1,'രകാര്യൻ',1200.50,'Completed',NOW()),
  (2,'Poornima', 550.00,'Pending',NOW()),
  (3,'അശ്വതി', 2300.00,'Completed',NOW()),
  (4,'ദേവൻ',  780.75,'Cancelled',NOW()),
  (5,'വിധു',  1450.00,'Completed',NOW()),
  (6,'ഗാന്ധർവ',  330.25,'Pending',NOW()),
  (7,'നിഷാദ്',  980.00,'Completed',NOW()),
  (8,'സന്തോഷ്', 1250.00,'Pending',NOW()),
  (9,'പവിത്ര',  670.40,'Completed',NOW()),
  (10,'മിലൻ', 890.00,'Pending',NOW());

-- 10. ORDER_ITEMS
INSERT INTO order_items (order_id, product_id, quantity, price, shop_id) VALUES
  (1,2, 3,  50.00,1),
  (1,5, 1, 120.50,1),
  (2,1, 2, 275.00,2),
  (3,4, 5,  460.00,3),
  (4,3, 1,  78.75,4),
  (5,6, 2,  725.00,5),
  (6,7, 4,   82.56,6),
  (7,8, 3,  490.00,7),
  (8,9, 2,  625.00,8),
  (9,10,1,  670.40,9);

COMMIT;
