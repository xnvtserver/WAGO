import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// Routes
import authRoutes from './Auth/routes/index.js';
import ProductAndPricingRoutes from './ProductAndPricing/ProductAndPricingRoutes.js';
import billingRoutes from './Billing/routes/billing.js';
import settingsRoutes from './settingsPage/route/settingsRoutes.js';
import inventoryRoutes from './shops-inventory/routes/inventory.js';
import dashboardRoutes from './Dashboard/dashboardRoutes.js';
import invRoutes from './shops/routes/shops.js'; // these shop routes are also pointing to the inventory shop also
import shopPermissionRoutes from './shops/shopPermissions/shopPermissionRoutes.js';
import dashboard_sales_chart from './Dashboard/sales/salesRoute.js';
import notiRoutes from './Dashboard/notification/notificationRouter.js';
import salesRoutes from './sales/sales.js';
import suppliers from  './suppliers/suppliersRoutes.js'
// Utilities
import { errorHandler } from './middleware/errorHandler.js';
import db from './config/db.js';
import ExcelUploadProductAddingRoutes from './ProductAndPricing/util/ExcelUpload/ExcelUploadProductAddingRouter.js';
import purchaseOrderRoutes from './purchaseManagement/POROUTES.js';
import utility  from './utility/routes.js';
import transferProducts from './utility/transferProductsBetweenShops.js'

const app = express();

// Configuration
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create upload directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'public/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage config for generic file uploads (if needed)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, JPEG, JPG, and PNG files are allowed'));
  }
});

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ✅ Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use((req, res, next) => {
  console.log(`📡 Request from origin: ${req.headers.origin}`);
  next();
});

// prot 5173 is for production and 5174 is for development
const allowedOrigins = [
  'http://localhost:5175',// development server
  'http://192.168.0.101:5175',
  'http://carwash.xnovity.com',
  'https://carwash.xnovity.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  credentials: true // if using cookies/auth headers
}));


app.use(express.json());
// Serve uploaded static files
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/ProductAndPricingRoutes', ProductAndPricingRoutes);
app.use('/api/inv/', invRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/', settingsRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/shop-permissions/', shopPermissionRoutes);
app.use('/dashboard/sales', dashboard_sales_chart);
app.use('/api/noti/', notiRoutes);
app.use('/api/ExcelUploadProductAdding/', ExcelUploadProductAddingRoutes);
app.use('/dashboard',dashboardRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/suppliers',suppliers);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/utility', utility);
app.use('/api/transferProducts', transferProducts);
// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Development request logger
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

// Database connection check + Server start
const startServer = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Database connected');
    app.listen(PORT,'0.0.0.0', () => {
    console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
    console.log(`🌐 Origin: ${process.env.FRONTEND_URL || 'Origin not set'}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
