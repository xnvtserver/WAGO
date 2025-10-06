import express from 'express';
import multer from 'multer';
import { bulkCreateProducts } from './ExcelUploadProductAddingController.js';
import { authenticate } from '../../../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/:shopId/upload',
  authenticate,
  upload.single('file'),
  bulkCreateProducts
);

export default router;