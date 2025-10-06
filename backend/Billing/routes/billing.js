//Backend/Billing/routes/billing.js
import express from 'express';
import BillingController from '../controller/BillingController.js';
import { authenticate } from '../../middleware/auth.js'; // Import the correct middleware

const router = express.Router();
router.use(authenticate); // Apply the authentication middleware to all routes in this file

router.get('/products', BillingController.getShopProducts);
router.post('/process-sale', BillingController.processSale);
router.get('/products/by-barcode/:barcode', BillingController.getProductByBarcode);

export default router;