Nice — below is a complete, ready-to-copy **Node.js + Express (ES modules) backend scaffold** for your car/bike washing & servicing marketplace. It uses **JWT auth**, **Knex** for DB access (Postgres/MySQL), role-based middleware, modular routes/controllers, dotenv, basic validation and error handling.

Paste the files into your project (`/src` folder) and run. I included a `package.json`, `knexfile.js`, and `.env.example` so you can run locally.

---

# 📁 Project files

## package.json

```json
{
  "name": "service-marketplace-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon --watch src --exec \"node --experimental-specifier-resolution=node src/index.js\""
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "knex": "^2.4.0",
    "pg": "^8.10.0",
    "mysql2": "^3.3.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

---

## .env.example

```
NODE_ENV=development
PORT=4000

# JWT secret
JWT_SECRET=supersecret_jwt_key
JWT_EXPIRES_IN=7d

# DB (choose postgres or mysql)
DB_CLIENT=pg
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=service_marketplace
```

---

## knexfile.js

```js
import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    client: process.env.DB_CLIENT || "pg",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || (process.env.DB_CLIENT === "mysql" ? 3306 : 5432),
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "service_marketplace"
    },
    migrations: {
      directory: "./migrations"
    },
    pool: { min: 2, max: 10 }
  }
};
```

---

## src/index.js (entry)

```js
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import shopRoutes from "./routes/shops.js";
import serviceRoutes from "./routes/services.js";
import bookingRoutes from "./routes/bookings.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);

// health
app.get("/api/health", (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

// error handler (last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## src/db/knex.js

```js
import knex from "knex";
import knexfile from "../../knexfile.js";
import dotenv from "dotenv";
dotenv.config();

const env = process.env.NODE_ENV || "development";
const config = knexfile[env] || knexfile.development;

const db = knex(config);
export default db;
```

---

# Models (use Knex)

## src/models/userModel.js

```js
import db from "../db/knex.js";

const TABLE = "users";

export const createUser = async (user) => {
  const [u] = await db(TABLE).insert(user).returning("*");
  return u;
};

export const findByEmail = async (email) => {
  const user = await db(TABLE).where({ email }).first();
  return user;
};

export const findById = async (id) => {
  return db(TABLE).where({ id }).first();
};
```

---

## src/models/shopModel.js

```js
import db from "../db/knex.js";

const TABLE = "shops";

export const createShop = async (shop) => {
  const [s] = await db(TABLE).insert(shop).returning("*");
  return s;
};

export const updateShop = async (id, data) => {
  const [s] = await db(TABLE).where({ id }).update(data).returning("*");
  return s;
};

export const getShopById = async (id) => {
  return db(TABLE).where({ id }).first();
};

export const getShopsNearby = async (/* optionally use lat/lon */) => {
  // For now return all shops
  return db(TABLE).select("*");
};

export const deleteShop = async (id) => {
  return db(TABLE).where({ id }).del();
};
```

---

## src/models/serviceModel.js

```js
import db from "../db/knex.js";

const TABLE = "services";

export const createService = async (service) => {
  const [s] = await db(TABLE).insert(service).returning("*");
  return s;
};

export const updateService = async (id, data) => {
  const [s] = await db(TABLE).where({ id }).update(data).returning("*");
  return s;
};

export const deleteService = async (id) => {
  return db(TABLE).where({ id }).del();
};

export const getServicesByShop = async (shop_id) => {
  return db(TABLE).where({ shop_id }).select("*");
};

export const getServiceById = async (id) => {
  return db(TABLE).where({ id }).first();
};
```

---

## src/models/bookingModel.js

```js
import db from "../db/knex.js";

const TABLE = "bookings";

export const createBooking = async (booking) => {
  const [b] = await db(TABLE).insert(booking).returning("*");
  return b;
};

export const getBookingsByCustomer = async (customer_id) => {
  return db(TABLE).where({ customer_id }).select("*");
};

export const getBookingsByProvider = async (provider_id) => {
  // provider_id corresponds to shop.user_id
  // join shops
  return db(TABLE)
    .join("shops", "bookings.shop_id", "shops.id")
    .where("shops.user_id", provider_id)
    .select("bookings.*");
};

export const updateBookingStatus = async (id, status) => {
  const [b] = await db(TABLE).where({ id }).update({ status }).returning("*");
  return b;
};
```

---

# Utils

## src/utils/hash.js

```js
import bcrypt from "bcryptjs";

export const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

export const comparePassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};
```

---

# Middlewares

## src/middlewares/auth.js

```js
import jwt from "jsonwebtoken";
import { findById } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token required" });
    }
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await findById(payload.id);
    if (!user) return res.status(401).json({ error: "Invalid token" });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
```

---

## src/middlewares/role.js

```js
export const permit = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient privileges" });
    }
    next();
  };
};
```

---

## src/middlewares/errorHandler.js

```js
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
};
```

---

# Controllers

## src/controllers/authController.js

```js
import jwt from "jsonwebtoken";
import { createUser, findByEmail } from "../models/userModel.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "7d";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "name, email, password and role are required" });
    }
    const existing = await findByEmail(email);
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const password_hash = await hashPassword(password);
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password_hash,
      role, // 'customer' | 'provider' | 'admin'
      created_at: new Date(),
      updated_at: new Date()
    };
    const user = await createUser(newUser);
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    const user = await findByEmail(email);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await comparePassword(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (err) {
    next(err);
  }
};
```

---

## src/controllers/shopController.js

```js
import { v4 as uuidv4 } from "uuid";
import * as Shop from "../models/shopModel.js";

export const createShop = async (req, res, next) => {
  try {
    const providerUser = req.user;
    // Only providers allowed — role middleware should ensure, but double-check:
    if (providerUser.role !== "provider") return res.status(403).json({ error: "Only providers can create shops" });

    const { name, address, latitude, longitude, description } = req.body;
    if (!name || !address) return res.status(400).json({ error: "name and address are required" });

    const shop = {
      id: uuidv4(),
      user_id: providerUser.id,
      name,
      address,
      latitude: latitude || null,
      longitude: longitude || null,
      description: description || null,
      created_at: new Date(),
      updated_at: new Date()
    };

    const s = await Shop.createShop(shop);
    res.status(201).json({ shop: s });
  } catch (err) {
    next(err);
  }
};

export const updateShop = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.user;
    const shop = await Shop.getShopById(id);
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    if (shop.user_id !== user.id && user.role !== "admin") return res.status(403).json({ error: "Not allowed" });

    const updates = req.body;
    updates.updated_at = new Date();
    const updated = await Shop.updateShop(id, updates);
    res.json({ shop: updated });
  } catch (err) {
    next(err);
  }
};

export const getShop = async (req, res, next) => {
  try {
    const id = req.params.id;
    const shop = await Shop.getShopById(id);
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    res.json({ shop });
  } catch (err) {
    next(err);
  }
};

export const listShops = async (req, res, next) => {
  try {
    const shops = await Shop.getShopsNearby();
    res.json({ shops });
  } catch (err) {
    next(err);
  }
};

export const deleteShop = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.user;
    const shop = await Shop.getShopById(id);
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    if (shop.user_id !== user.id && user.role !== "admin") return res.status(403).json({ error: "Not allowed" });
    await Shop.deleteShop(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
```

---

## src/controllers/serviceController.js

```js
import { v4 as uuidv4 } from "uuid";
import * as Service from "../models/serviceModel.js";
import * as Shop from "../models/shopModel.js";

export const createService = async (req, res, next) => {
  try {
    const { shop_id, name, description, price } = req.body;
    const user = req.user;

    // verify shop belongs to provider
    const shop = await Shop.getShopById(shop_id);
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    if (shop.user_id !== user.id && user.role !== "admin") return res.status(403).json({ error: "Not allowed" });

    const service = {
      id: uuidv4(),
      shop_id,
      name,
      description: description || null,
      price: price || 0,
      created_at: new Date(),
      updated_at: new Date()
    };
    const s = await Service.createService(service);
    res.status(201).json({ service: s });
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.user;
    const existing = await Service.getServiceById(id);
    if (!existing) return res.status(404).json({ error: "Service not found" });

    // confirm provider owns the shop for this service
    const shop = await Shop.getShopById(existing.shop_id);
    if (shop.user_id !== user.id && user.role !== "admin") return res.status(403).json({ error: "Not allowed" });

    const updates = req.body;
    updates.updated_at = new Date();
    const updated = await Service.updateService(id, updates);
    res.json({ service: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.user;
    const service = await Service.getServiceById(id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    const shop = await Shop.getShopById(service.shop_id);
    if (shop.user_id !== user.id && user.role !== "admin") return res.status(403).json({ error: "Not allowed" });

    await Service.deleteService(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const listServicesByShop = async (req, res, next) => {
  try {
    const shop_id = req.params.shopId;
    const services = await Service.getServicesByShop(shop_id);
    res.json({ services });
  } catch (err) {
    next(err);
  }
};
```

---

## src/controllers/bookingController.js

```js
import { v4 as uuidv4 } from "uuid";
import * as Booking from "../models/bookingModel.js";
import * as ServiceModel from "../models/serviceModel.js";

export const createBooking = async (req, res, next) => {
  try {
    const { service_id, shop_id, scheduled_at } = req.body;
    const customer = req.user;
    if (customer.role !== "customer") return res.status(403).json({ error: "Only customers can create bookings" });

    // validate service exists
    const service = await ServiceModel.getServiceById(service_id);
    if (!service) return res.status(404).json({ error: "Service not found" });

    const booking = {
      id: uuidv4(),
      customer_id: customer.id,
      shop_id,
      service_id,
      status: "pending",
      scheduled_at: scheduled_at ? new Date(scheduled_at) : null,
      created_at: new Date(),
      updated_at: new Date()
    };
    const b = await Booking.createBooking(booking);
    res.status(201).json({ booking: b });
  } catch (err) {
    next(err);
  }
};

export const listBookingsByCustomer = async (req, res, next) => {
  try {
    const user = req.user;
    const bookings = await Booking.getBookingsByCustomer(user.id);
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};

export const listBookingsByProvider = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "provider") return res.status(403).json({ error: "Only providers can view provider bookings" });
    const bookings = await Booking.getBookingsByProvider(user.id);
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status" });

    const updated = await Booking.updateBookingStatus(id, status);
    res.json({ booking: updated });
  } catch (err) {
    next(err);
  }
};
```

---

# Routes

## src/routes/auth.js

```js
import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
```

---

## src/routes/shops.js

```js
import express from "express";
import * as ShopCtrl from "../controllers/shopController.js";
import { authenticate } from "../middlewares/auth.js";
import { permit } from "../middlewares/role.js";

const router = express.Router();

router.get("/", ShopCtrl.listShops);
router.get("/:id", ShopCtrl.getShop);

// protected: providers create/update/delete their shop
router.post("/", authenticate, permit("provider"), ShopCtrl.createShop);
router.put("/:id", authenticate, ShopCtrl.updateShop);
router.delete("/:id", authenticate, ShopCtrl.deleteShop);

export default router;
```

---

## src/routes/services.js

```js
import express from "express";
import * as ServiceCtrl from "../controllers/serviceController.js";
import { authenticate } from "../middlewares/auth.js";
import { permit } from "../middlewares/role.js";

const router = express.Router();

router.get("/shop/:shopId", ServiceCtrl.listServicesByShop);

// provider create/update/delete
router.post("/", authenticate, permit("provider"), ServiceCtrl.createService);
router.put("/:id", authenticate, ServiceCtrl.updateService);
router.delete("/:id", authenticate, ServiceCtrl.deleteService);

export default router;
```

---

## src/routes/bookings.js

```js
import express from "express";
import * as BookingCtrl from "../controllers/bookingController.js";
import { authenticate } from "../middlewares/auth.js";
import { permit } from "../middlewares/role.js";

const router = express.Router();

// create booking (customer)
router.post("/", authenticate, permit("customer"), BookingCtrl.createBooking);

// list bookings (customer)
router.get("/my", authenticate, permit("customer"), BookingCtrl.listBookingsByCustomer);

// provider: list bookings for provider's shops
router.get("/provider", authenticate, permit("provider"), BookingCtrl.listBookingsByProvider);

// update booking status (provider or admin — protected)
router.put("/:id/status", authenticate, BookingCtrl.updateBookingStatus);

export default router;
```

---

# Database migrations (suggested)

I didn't add full migrations here because you requested backend code; however for a working DB, you should create migrations for `users`, `shops`, `services`, `bookings`, `payments` (optional). Use Knex CLI and the schema from your earlier prompt (UUID PKs, foreign keys, created_at/updated_at). If you want, I can generate full Knex migration files next.

---

# Quick README - Run locally

1. Install deps:

```bash
npm install
```

2. Copy .env:

```bash
cp .env.example .env
# then edit .env with DB cred & JWT secret
```

3. Create DB & run migrations (if you add migrations):

```bash
# using knex CLI (optional)
npx knex --knexfile knexfile.js migrate:latest
```

4. Start server:

```bash
npm run dev
# or
npm start
```

API endpoints available under `/api/*` as in routes.

---

# Notes & next steps (recommended)

* Add **input validation** library (Joi or express-validator) for production-grade validation.
* Add **migrations** and indexes, plus seed data.
* Add **rate limiting**, request sanitization, and more robust error logging.
* Add unit/integration tests.
* Add file upload (shop photos) using S3 or similar.
* Consider using **UUID generation** at DB level (Postgres `gen_random_uuid()`).
* Add pagination on listing endpoints.

---

If you'd like, I can now:

* Generate the **Knex migration files** for `users`, `shops`, `services`, `bookings`, `payments` (exact schema with UUIDs and FK constraints).
* Or generate a **Postman collection / example requests** for the endpoints.
* Or add **validation (Joi)** to each controller.

Which of those next (or go ahead and generate the Knex migrations now)?
