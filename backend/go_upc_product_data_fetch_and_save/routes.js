const express = require('express');
const productController = require('./controllers/productController');

const router = express.Router();

router.get('/go_upc_product_data_fetch_and_save/:barcode', productController.getProductByBarcode);

module.exports = router;