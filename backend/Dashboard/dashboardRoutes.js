//Backend/Dashboard/dashboardRoutes.js
import express from 'express';
import dashboardController from './dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
console.log('*************** Dashboard Routes Called ******************');
// Dashboard routes
router.get('/stats', authenticate, dashboardController.getDashboardStats);
router.get('/sales', authenticate, dashboardController.getSalesData);
router.get('/recent-orders', authenticate, dashboardController.getRecentOrders);
router.get('/top-products', authenticate, dashboardController.getTopProducts);
router.get('/inventory-alerts', authenticate, dashboardController.getInventoryAlerts);
router.get('/store-inventory', authenticate, dashboardController.getStoreInventory);

export default router;