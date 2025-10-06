import express from 'express';
import { getSalesHistory , recent} from './salesController.js';
import { getSalesStats } from './sales_stats_controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

console.log('Inside sales routes');
router.get('/saleshistory/:shopId', authenticate , getSalesHistory);//authenticate,
router.get('/:shopId/recent', authenticate , recent);//authenticate,
router.get("/stats/:shop_id", getSalesStats);

export default router;
