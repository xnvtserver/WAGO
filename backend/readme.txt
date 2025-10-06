FEATURE_LIST & Status{

    AUTHENTICATION : PARTIALLY COMPLETED NEED TO DO FORGOT PASSWORD AND OTHER DETAILED SETTINGS

    PRODUCT CREATION : DONE , NEED TESTING AND WORKAROUD AGAINST TEST BUGS

    PRODUCT BILLING : DONE , NEED TESTING AND WORKAROUD AGAINST TEST BUGS

    transferProductsBetweenShops : BACKEND AND FRONTEND CODE CHANGES NOT TESTED , NEED FUNCTIONAL AND CODE TESTING

    

}











# Node.js Backend with PostgreSQL for Price Management

This document outlines the implementation of a Node.js backend with PostgreSQL for managing product and shop pricing.

## Tech Stack

* **Node.js + Express (REST API):** Backend runtime and framework for building the API.
* **PostgreSQL (Relational database):** Robust and scalable relational database for storing application data.
* **Knex.js (Query builder):** SQL query builder for Node.js, simplifying database interactions.
* **Joi (Validation):** Schema description language and validator for JavaScript objects.
* **Jest (Testing):** JavaScript testing framework for unit and integration tests.
* **Swagger (Documentation):** Specification and tooling for describing, producing, consuming, and visualizing RESTful APIs.
* **vue.js (front-end):** JavaScript framework for building the user interface (note: frontend implementation details are outside the scope of this backend documentation).

## Installation and Setup

1.  **Initialize Node.js project:**
    ```bash
    npm init -y
    ```

2.  **Install core backend dependencies:**
    ```bash
    npm install express pg knex dotenv cors body-parser
    ```
    * `express`: Web application framework.
    * `pg`: PostgreSQL client for Node.js.
    * `knex`: SQL query builder.
    * `dotenv`: Loads environment variables from a `.env` file.
    * `cors`: Enables Cross-Origin Resource Sharing.
    * `body-parser`: Parses request bodies.

3.  **Install development dependency (nodemon):**
    ```bash
    npm install -D nodemon
    ```
    * `nodemon`: Automatically restarts the server upon file changes during development.

4.  **Install additional dependencies:**
    ```bash
    npm install express pg bcryptjs jsonwebtoken dotenv cors multer helmet morgan
    npm install express-validator
    npm install multer
    // npm install xlsx
    npm install exceljs

    ```
    * `bcryptjs`: For password hashing.
    * `jsonwebtoken`: For creating and verifying JSON Web Tokens for authentication.
    * `multer`: For handling file uploads.
    * `helmet`: For securing Express apps by setting various HTTP headers.
    * `morgan`: HTTP request logger middleware for Node.js.

5.  **Database Configuration (`knexfile.js`):**
    Ensure your `knexfile.js` is properly configured with your PostgreSQL database connection details (client, connection string/host, port, user, password, database).

6.  **Database Migrations (`db/migrations`):**
    Knex migrations are used to manage the database schema over time. Check the `db/migrations` directory for existing migration files.

7.  **Run Migrations:**
    ```bash
    npx knex migrate:latest
    ```
    This command runs all pending database migrations.

## Running the Application

1.  **Start the server:**
    ```bash
    nodemon server.js
    ```
    (or `node server.js` if you don't have nodemon installed)

2.  **Run Migrations (if needed):**
    ```bash
    npx knex migrate:latest
    ```
    This ensures your database schema is up-to-date.

## Database Migrations Troubleshooting

If you encounter issues with database migrations, here are a couple of solutions:

**Solution 1: Rollback and Re-run Migrations**

1.  **Rollback the last migration:**
    ```bash
    npx knex migrate:rollback
    ```

2.  **If that doesn't work, rollback all migrations:**
    ```bash
    npx knex migrate:rollback --all
    ```

3.  **(Optional but recommended for a clean slate) Drop and recreate the public schema:**
    ```bash
    psql -U your_user -d your_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
    ```
    Replace `your_user` and `your_db` with your PostgreSQL username and database name. **Warning:** This will delete all data in the public schema.

4.  **Re-run the migrations:**
    ```bash
    npx knex migrate:latest
    ``

## Key Endpoints

### Products

* `GET /products`: List all products.
* `GET /products/:id/prices`: Get all price types for a specific product.
* `PUT /products/:id/base-price`: Update the base price of a product.

### Shops

* `GET /shops`: List all stores.
* `GET /shops/:id/prices`: Get prices for a specific store.
* `POST /shops/bulk-update`: Mass update prices for multiple shops.

### Pricing

* `GET /prices/history/:productId`: Get the price change history for a specific product.
* `POST /prices/bulk`: Create bulk pricing tiers for a product.
* `PUT /prices/shop/:id`: Update the shop-specific price for a product in a shop (likely requires product and shop IDs in the path or body).

### Product Price Management (Alternative Endpoint Grouping)

* `GET /api/pricing/products/:productId`: Get comprehensive pricing information for a product.
* `PUT /api/pricing/products/:productId/base-price`: Update the base price of a product.
* `GET /api/pricing/products/:productId/shops`: Get shop-specific prices for a product.
* `PUT /api/pricing/products/:productId/batch-update`: Batch update prices for a product across different shops or tiers.
* `GET /api/pricing/products/:productId/history`: Get the price history for a product.

## Database Relationships

* **Products**
    * has one **BasePrices** (1:1)
    * has many **ShopPrices** (1:many)
    * has many **BulkPricing** (1:many)
    * has many **PriceHistory** (1:many)
* **Shops**
    * has many **ShopPrices** (1:many)


## Addition: Initial Database Schema Migration

This section details the structure of the initial database schema defined in a Knex migration file (`YYYYMMDDHHMMSS_initial_schema.js`). This schema lays the foundation for managing users, shops, products, pricing, inventory, employee roles, permissions, price history, and promotions.

**Brief Overview of the Schema:**

The schema defines several interconnected tables designed to support the core functionalities of a multi-store retail management system. It includes tables for user management with different roles, shop management with ownership details, product catalog management, inventory and pricing at the shop level, employee profiles with manager relationships, granular permission control for employees within specific shops, a history of price changes for auditing, and a basic promotions system.

**Key Tables and Their Purpose:**

* **`permission_type` (ENUM):** A custom enumeration defining the different types of permissions that can be assigned to users within shops (e.g., `view_dashboard`, `manage_inventory`).
* **`users`:** Stores user information, including name, email (unique), password hash, phone, optional license file, terms acceptance, and a global user role (`owner`, `employee`, `customer`). Importantly, this table does not directly link to shops.
* **`shops`:** Stores information about individual store locations, including name, location, contact details, status (`active`, `inactive`, `needs-update`), and a foreign key `owner_id` referencing the `users` table to identify the shop owner.
* **`products`:** Stores general product information that is consistent across all shops, such as name, description, active status, SKU (unique), barcode (unique), category, brand, unit, and unit value. This table is shop-agnostic.
* **`shop_products`:** A junction table establishing a many-to-many relationship between `shops` and `products`. It stores shop-specific details like `retail_price`, `wholesale_price`, `purchase_price`, and `stock` levels. The combination of `shop_id` and `product_id` is unique.
* **`employee_profiles`:** Stores additional information specific to employees, linking a `user_id` (from the `users` table) to a `managed_by` user (their manager) and an `is_active` status.
* **`shop_permissions`:** Defines the specific permissions a user has within a particular shop. It links `user_id` and `shop_id` and uses the `permission_type` ENUM as an array to store the granted permissions for a specific `role` (e.g., `manager`, `cashier`). The combination of `user_id` and `shop_id` is unique.
* **`price_history`:** Tracks changes to product prices. It records the `product_id`, the optional `shop_id` (for shop-specific changes), the `price_type` (`retail`, `wholesale`, `purchase`), the `old_price`, the `new_price`, and the `changed_by` user (referencing the `users` table).
* **`promotions`:** Stores information about promotional offers available in specific shops, including the `shop_id`, offer text, start and end dates, minimum purchase amount, and discount percentage.

**Key Relationships and Constraints:**

* Foreign key constraints are used extensively to maintain data integrity between related tables (e.g., `owner_id` in `shops` referencing `users`).
* `UNIQUE` constraints are used to ensure data uniqueness where required (e.g., `email` in `users`, `sku` and `barcode` in `products`, `shop_id` + `product_id` in `shop_products`, `user_id` + `shop_id` in `shop_permissions`).
* `NOT NULL` constraints enforce the presence of essential data in certain columns.
* Indexes are added to frequently queried columns (like foreign keys) to improve database performance.
* `ON DELETE CASCADE` is used in foreign key relationships to automatically delete related records when a parent record is deleted (e.g., deleting a user will delete their associated shops).

This initial schema provides a robust foundation for the price management and overall retail operations backend, supporting multi-store functionality and granular user permissions. Subsequent migrations can build upon this schema to add more features and refine the data model.

## Core Entities

* **Products:** Base product information (SKU, barcode, category).
* **Shops:** Store locations and statuses (active/inactive).
* **Base Prices:** Default pricing for products.
* **Shop Prices:** Store-specific price overrides for products.
* **Bulk Pricing:** Quantity-based tiered pricing for products.
* **Price History:** Audit trail of all price changes for products (base, shop-specific, bulk).

## Key Features

* **Multi-level pricing strategies:** Supports base prices, shop-specific overrides, and bulk discounts.
* **Store-specific price customization:** Allows setting different prices for the same product in different stores.
* **Historical price tracking:** Maintains a record of all price changes, including the type of change and the user who made it.
* **Bulk update capabilities:** Enables efficient updating of prices for multiple products or shops simultaneously.
* **Quantity-based discounts:** Implements tiered pricing based on the quantity of products purchased.
* **Active/inactive store management:** Allows controlling the visibility and availability of stores.

## Database Table Details

### `Shop Prices` Table

* Enforces a unique combination of `product_id` and `shop_id`.
* References the `products` and `shops` tables via foreign keys.
* Stores the `retail_price` specific to a shop for a product.
* Includes an `updated_at` timestamp to track the last price update.

### `Bulk Pricing` Table

* Implements quantity-tiered pricing for products.
* Includes `min_quantity` and `max_quantity` to define the price range.
* Contains a `price` for the specified quantity range.
* Has an `is_active` flag to enable or disable specific pricing tiers.
* References the `products` table via a foreign key.
* Includes validation to ensure `min_quantity` is less than `max_quantity`.

### `Price History` Table

* Tracks all types of price changes: base price, shop-specific price, and bulk price.
* Stores both the `old_value` and `new_value` of the price change as JSONB for flexibility.
* Includes fields to identify whether the change was global (affecting base price or bulk rules) or shop-specific.
* Potentially includes information about the `auditor` (user or system) who made the change.
* Includes a `created_at` timestamp for tracking when the change occurred.
* Optimized indexing on `product_id` and `created_at` for efficient historical analysis queries.







 AUTHENTICATION MODULE
✅ Login Page 
✅ Register Page with Role Selection
 Upload Optional License File
 Accept Terms & Conditions
 Email Verification Page (Optional)
 Forgot/Reset Password Workflow

✅ DASHBOARD MODULE (Role-based)
 Quick Stats: Sales, Revenue, Low Stock
 Multi-Shop Selector
 Recent Sales Widget
 Low Stock Alerts
 Upcoming Promotions Display
 Pending Price Updates Display
 Notifications Center

✅ SHOP MANAGEMENT
 Shop List Page
 Add/Edit Shop Details (Name, Contact, Status)
 Assign Employees to Shop
 Set Shop-wide Settings (Business hours, Branding)
 Shop Status Filters: Active, Inactive, Needs-update

✅ USER & EMPLOYEE MANAGEMENT
 Users Overview Page (Filter by Role)
 Create/Edit Employee Profiles
 Link Employee to Manager (managed_by)
 Activate/Deactivate Employees
 Set/Update shop_permissions (with permission_type[])

✅ PRODUCT & INVENTORY MANAGEMENT
 Global Product Catalog Page
 Add/Edit Product (SKU, Barcode, Description, Brand, Unit)
 Shop-Specific Product List
 Add Product to Shop
 Edit Shop-specific Prices (Retail, Wholesale, Purchase)
 Update Stock Levels
 Low Stock Alert Page
 Export/Email Low Stock Report to Supplier
 Bulk Stock Import (CSV/Excel)
 Bulk Stock Export (CSV/Excel)

✅ PRICE MANAGEMENT
 Current Price Matrix per Shop
 Price History Viewer
 Filter by Product, Shop, Price Type, Date
 Track Changed By (users)

✅ PROMOTIONS MODULE
 List of Promotions per Shop
 Add/Edit Promotions (Discount %, Dates, Min Purchase)
 Status Filters (Upcoming, Active, Expired)

✅ NOTIFICATIONS & ALERTS
 Central Notification Panel
 Low Stock Alert Setup
 Promotion Reminders
 Expired Promotion Alerts
 Employee Changes
 Price Updates

✅ SUPPLIER COMMUNICATION
 Low Stock Product Report Page
 Export Report as CSV/PDF
 Schedule Auto-Send to Supplier via Email/SMS
 Configure Supplier Contact Info

✅ REPORTS & ANALYTICS
 Daily/Weekly/Monthly Sales Reports
 Inventory Valuation Report
 Price Trend Charts
 Promotion Performance Metrics
 Employee Activity Logs

✅ SETTINGS MODULE
 User Profile Settings
 Password & Security Settings
 Notification Preferences
 Shop Configuration Settings (Tax, Branding, etc.)


🛠️ With n8n + Self-Hosting, You Can Do This in a Retail SaaS Context:
🔔 1. Notifications & Alerts
Send email/SMS to customers or store managers when:

Orders are placed

Inventory is low

Payments fail or succeed

Use: Email, Twilio, Slack, Telegram nodes

🧾 2. Invoice & Document Automation
Auto-generate and email invoices, receipts, order slips

Convert HTML or template to PDF

Integrate with Google Drive or Dropbox for storage

📦 3. Inventory & Stock Management
Trigger alerts or workflows when:

Stock drops below threshold

Supplier restocking is needed

Auto-update 3rd-party inventory tools (e.g., Zoho, Airtable, Shopify)

📆 4. Scheduling & Campaigns
Schedule promotions, emails, or reminders

Use cron triggers to:

Run daily reports

Send weekly performance updates to store owners

🔁 5. Sync with 3rd-Party Tools
Sync customer & order data with:

CRM (e.g., HubSpot, Salesforce)

ERP (e.g., Zoho, Odoo)

Accounting (e.g., QuickBooks, Tally)

Handle multi-channel sales (Shopify, Amazon, WooCommerce)

📈 6. Analytics & Reporting
Schedule and email:

Sales summary reports

Daily/weekly dashboards

Pull data from your database, transfo🛠️ With n8n + Self-Hosting, You Can Do This in a Retail SaaS Context:
🔔 1. Notifications & Alerts
Send email/SMS to customers or store managers when:

Orders are placed

Inventory is low

Payments fail or succeed

Use: Email, Twilio, Slack, Telegram nodes

🧾 2. Invoice & Document Automation
Auto-generate and email invoices, receipts, order slips

Convert HTML or template to PDF

Integrate with Google Drive or Dropbox for storage

📦 3. Inventory & Stock Management
Trigger alerts or workflows when:

Stock drops below threshold

Supplier restocking is needed

Auto-update 3rd-party inventory tools (e.g., Zoho, Airtable, Shopify)

📆 4. Scheduling & Campaigns
Schedule promotions, emails, or reminders

Use cron triggers to:

Run daily reports

Send weekly performance updates to store owners

🔁 5. Sync with 3rd-Party Tools
Sync customer & order data with:

CRM (e.g., HubSpot, Salesforce)

ERP (e.g., Zoho, Odoo)

Accounting (e.g., QuickBooks, Tally)

Handle multi-channel sales (Shopify, Amazon, WooCommerce)

📈 6. Analytics & Reporting
Schedule and email:

Sales summary reports

Daily/weekly dashboards

Pull data from your database, transform it, and send via email or Slack

🧑‍💼 7. Customer Lifecycle Automation
When a new customer registers:

Send welcome emails

Add them to a CRM

Schedule a follow-up call via Google Calendar

💳 8. Payments & Subscription Management
Monitor payment gateways (Stripe, Razorpay, etc.)

Trigger actions on:

Failed payments

Subscription renewals

Plan upgrades/downgrades

🔒 9. Backup & Data Operations
Automate DB backups (e.g., MySQL dump + upload to S3)

Archive logs or reports daily

Clean stale or old data

🧠 10. AI & Smart Features
Use OpenAI or Claude via API in n8n to:

Summarize support tickets

Auto-tag products or reviews

Generate SEO metadata for products

🧰 Example Workflows for Your Retail SaaS
Use Case	Trigger	Workflow
Low stock alert	Cron job or webhook	Query DB → Send Email/Slack
New order sync	Webhook from backend	Push to CRM + Email + Google Sheets
Customer review analysis	New review in DB	Analyze sentiment using OpenAI API
Subscription failed	Stripe webhook	Notify via email + mark account inactive
Scheduled email	Cron	Query active customers → Email campaign

🔐 Why Self-Hosting n8n Is Great for SaaS
Full control over data (important for retail businesses)

Integrate with internal APIs, microservices, or private databases

No vendor lock-in like Zapier or Make

Can scale horizontally (Docker, k8s)

Create custom reusable workflows per tenant/store

🏁 Final Thoughts
n8n lets you build powerful backend workflows without bloating your core app. In a multi-tenant SaaS, you can even:

Dynamically trigger workflows per tenant

Use tenant-specific credentials

Log or visualize executions via the n8n UI

rm it, and send via email or Slack

🧑‍💼 7. Customer Lifecycle Automation
When a new customer registers:

Send welcome emails

Add them to a CRM

Schedule a follow-up call via Google Calendar

💳 8. Payments & Subscription Management
Monitor payment gateways (Stripe, Razorpay, etc.)

Trigger actions on:

Failed payments

Subscription renewals

Plan upgrades/downgrades

🔒 9. Backup & Data Operations
Automate DB backups (e.g., MySQL dump + upload to S3)

Archive logs or reports daily

Clean stale or old data

🧠 10. AI & Smart Features
Use OpenAI or Claude via API in n8n to:

Summarize support tickets

Auto-tag products or reviews

Generate SEO metadata for products

🧰 Example Workflows for Your Retail SaaS
Use Case	Trigger	Workflow
Low stock alert	Cron job or webhook	Query DB → Send Email/Slack
New order sync	Webhook from backend	Push to CRM + Email + Google Sheets
Customer review analysis	New review in DB	Analyze sentiment using OpenAI API
Subscription failed	Stripe webhook	Notify via email + mark account inactive
Scheduled email	Cron	Query active customers → Email campaign

🔐 Why Self-Hosting n8n Is Great for SaaS
Full control over data (important for retail businesses)

Integrate with internal APIs, microservices, or private databases

No vendor lock-in like Zapier or Make

Can scale horizontally (Docker, k8s)

Create custom reusable workflows per tenant/store

🏁 Final Thoughts
n8n lets you build powerful backend workflows without bloating your core app. In a multi-tenant SaaS, you can even:

Dynamically trigger workflows per tenant

Use tenant-specific credentials

Log or visualize executions via the n8n UI

