import express from 'express';
import { getSalesData } from './salesController.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  getSalesData
);

export default router;
