// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('#');
const permissionMiddleware = require('#');

router.post('/:shopId/products/bulk-upload',
  authMiddleware,
  permissionMiddleware('manage_inventory'),
  uploadController.handleBulkUpload
);

module.exports = router;