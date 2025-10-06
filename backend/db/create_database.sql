-- Create the database (uncomment if needed)
-- CREATE DATABASE retail_solution;

-- Connect to the database (uncomment if needed)
-- \c retail_solution
-- Run it with psql:
--    psql -U postgres -d agvk -f create_database.sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  shop_name VARCHAR(255),
  owner_name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  license_file VARCHAR(255),
  terms_accepted BOOLEAN DEFAULT FALSE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'employee', 'customer')) DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create shops table
CREATE TABLE shops (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'needs-update')) DEFAULT 'active',
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create products table (must come before product_prices)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  retail_price DECIMAL(10, 2),
  wholesale_price DECIMAL(10, 2),
  purchase_price DECIMAL(10, 2),
  sku VARCHAR(255) UNIQUE NOT NULL,
  barcode VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  unit_value VARCHAR(50) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  shop_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- Create product_prices table
CREATE TABLE product_prices (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  purchase_price DECIMAL(15, 2) NOT NULL,
  retail_price DECIMAL(15, 2) NOT NULL,
  wholesale_price DECIMAL(15, 2) NOT NULL,
  price_policy VARCHAR(20) NOT NULL CHECK (price_policy IN ('fixed', 'percentage', 'tiered')) DEFAULT 'fixed',
  bulk_pricing_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create shop_prices table
CREATE TABLE shop_prices (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  shop_id INTEGER NOT NULL,
  retail_price DECIMAL(10, 2) NOT NULL,
  wholesale_price DECIMAL(10, 2) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_shop FOREIGN KEY (shop_id) REFERENCES shops(id),
  CONSTRAINT unique_product_shop UNIQUE (product_id, shop_id)
);

-- Create bulk_pricing table
CREATE TABLE bulk_pricing (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER NOT NULL,
  retail_price DECIMAL(10, 2) NOT NULL,
  wholesale_price DECIMAL(10, 2) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT check_quantity CHECK (min_quantity < max_quantity)
);

-- Create price_history table
CREATE TABLE price_history (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  shop_id INTEGER,
  price_type VARCHAR(20) NOT NULL CHECK (price_type IN ('base', 'retail', 'wholesale', 'purchase')),
  old_price JSONB NOT NULL,
  new_price JSONB NOT NULL,
  changed_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_shop FOREIGN KEY (shop_id) REFERENCES shops(id)
);

-- Create indexes
CREATE INDEX idx_price_history_product_type ON price_history (product_id, price_type);

-- promotions not implemented with knex migrations , this is for for promotions/offers
CREATE TABLE promotions (
  id SERIAL PRIMARY KEY,
  shop_id INTEGER NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  offer_text TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  min_purchase_amount DECIMAL(10, 2),
  discount_percentage DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK (end_date >= start_date)
);