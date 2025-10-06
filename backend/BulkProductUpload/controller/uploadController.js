const csv = require('csv-parser');
const { Readable } = require('stream');
const { Product, ShopProduct, PriceHistory } = require('../models');
const { createUploadChannel } = require('../services/realtimeService');

exports.handleBulkUpload = async (req, res) => {
  try {
    const { shopId } = req.params;
    const channel = createUploadChannel(req.user.id, shopId);
    
    const processor = async (fileStream) => {
      const results = [];
      let processedCount = 0;
      
      return new Promise((resolve, reject) => {
        fileStream
          .pipe(csv())
          .on('data', async (row) => {
            try {
              // Validate CSV row
              validateProductRow(row);
              
              // Process product
              const product = await processProduct(row, shopId, req.user.id);
              results.push(product);
              
              // Emit progress
              processedCount++;
              channel.emit('progress', {
                processed: processedCount,
                total: results.length
              });
            } catch (error) {
              channel.emit('error', { message: `Row ${processedCount}: ${error.message}` });
            }
          })
          .on('end', () => resolve(results))
          .on('error', reject);
      });
    };

    await processor(Readable.from(req.file.buffer));
    channel.emit('complete');
    res.status(202).json({ message: 'Upload started' });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

function validateProductRow(row) {
  const requiredFields = ['name', 'sku', 'retailPrice', 'stock'];
  requiredFields.forEach(field => {
    if (!row[field]) throw new Error(`Missing required field: ${field}`);
  });
}

async function processProduct(row, shopId, userId) {
  const transaction = await sequelize.transaction();
  
  try {
    // Find or create product
    const [product] = await Product.findOrCreate({
      where: { sku: row.sku },
      defaults: {
        name: row.name,
        barcode: row.barcode,
        brand: row.brand,
        category: row.category
      },
      transaction
    });

    // Create shop product relationship
    const shopProduct = await ShopProduct.create({
      shopId,
      productId: product.id,
      retail_price: row.retailPrice,
      wholesale_price: row.wholesalePrice,
      stock: row.stock
    }, { transaction });

    // Record price history
    await PriceHistory.create({
      productId: product.id,
      shopId,
      price_type: 'retail',
      old_price: null,
      new_price: row.retailPrice,
      changed_by: userId
    }, { transaction });

    await transaction.commit();
    return { product, shopProduct };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}