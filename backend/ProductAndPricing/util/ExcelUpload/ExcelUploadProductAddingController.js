// import xlsx from 'xlsx';
import ExcelJS from 'exceljs';
import fs from 'fs';
import db from '../../../config/db.js';

export const bulkCreateProducts = async (req, res) => {
  let uploadedFilePath;
  console.log('************   WORKING ON bulkCreateProducts **************');
  try {
    const { shopId } = req.params;
    const file = req.file;
    
    // Validate shop ID
    if (!shopId || isNaN(shopId)) {
      return res.status(400).json({ error: 'Invalid shop ID' });
    }

    // Validate file existence
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    uploadedFilePath = file.path;

    // Verify file exists physically
    if (!fs.existsSync(uploadedFilePath)) {
      throw new Error('Uploaded file not found on server');
    }

    // Read Excel file with error handling
    let workbook;
    try {
      workbook = ExcelJS.readFile(uploadedFilePath);
    } catch (readError) {
      throw new Error(`Invalid Excel file: ${readError.message}`);
    }

    // Validate worksheet existence
    if (!workbook.SheetNames.length) {
      throw new Error('Excel file contains no worksheets');
    }

    // FIX 1: Handle non-English sheet names
    const worksheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('data entri') || 
      name.toLowerCase().includes('data entry')
    ) || workbook.SheetNames[0];

    const worksheet = workbook.Sheets[worksheetName];
    const rows = ExcelJS.utils.sheet_to_json(worksheet);

    // Validate at least one data row
    if (!rows.length) {
      throw new Error('Excel file contains no data rows');
    }

    // FIX 2: Normalize header keys to lowercase
    const normalizedRows = rows.map(row => {
      const normalized = {};
      for (const key in row) {
        normalized[key.trim().toLowerCase()] = row[key];
      }
      return normalized;
    });

    const requiredFields = [
      'name', 'category', 'unit', 'unit_value',
      'sku', 'retail_price', 'stock'
    ];

    const results = {
      created: 0,
      updated: 0,
      errors: []
    };

    await db.transaction(async trx => {
      for (const [index, row] of normalizedRows.entries()) {
        const rowNumber = index + 2;
        try {
          // FIX 3: Handle empty values
          const cleanRow = {};
          for (const key in row) {
            cleanRow[key] = (typeof row[key] === 'string') 
              ? row[key].trim() 
              : row[key];
          }

          // Validate required fields
          const missingFields = requiredFields.filter(field => 
            !cleanRow[field] && cleanRow[field] !== 0
          );
          
          if (missingFields.length > 0) {
            results.errors.push(`Row ${rowNumber}: Missing ${missingFields.join(', ')}`);
            continue;
          }

          // Numeric validation
          const numericFields = {
            unit_value: Number(cleanRow.unit_value),
            retail_price: Number(cleanRow.retail_price),
            stock: Number(cleanRow.stock)
          };

          if (Object.values(numericFields).some(isNaN)) {
            results.errors.push(`Row ${rowNumber}: Invalid numeric values`);
            continue;
          }

          // Check existing SKU in shop_products
          const existingShopProduct = await trx('shop_products')
            .where({ shop_id: shopId, sku: cleanRow.sku })
            .first();

          if (existingShopProduct) {
            // Update existing product
            await trx('products')
              .where({ id: existingShopProduct.product_id })
              .update({
                name: cleanRow.name,
                category: cleanRow.category,
                brand: cleanRow.brand || null,
                unit: cleanRow.unit,
                unit_value: numericFields.unit_value,
                description: cleanRow.description || null,
                image: cleanRow.image ? `/uploads/products/${cleanRow.image}` : null,
                is_active: String(cleanRow.is_active).toLowerCase() === 'true'
              });

            await trx('shop_products')
              .where({ id: existingShopProduct.id })
              .update({
                barcode: cleanRow.barcode || null,
                retail_price: numericFields.retail_price,
                wholesale_price: cleanRow.wholesale_price ? Number(cleanRow.wholesale_price) : null,
                purchase_price: cleanRow.purchase_price ? Number(cleanRow.purchase_price) : null,
                stock: numericFields.stock
              });

            results.updated++;
          } else {
            // Create new product
            const [newProduct] = await trx('products')
              .insert({
                name: cleanRow.name,
                category: cleanRow.category,
                brand: cleanRow.brand || null,
                unit: cleanRow.unit,
                unit_value: numericFields.unit_value,
                description: cleanRow.description || null,
                image: cleanRow.image ? `/uploads/products/${cleanRow.image}` : null,
                is_active: String(cleanRow.is_active).toLowerCase() === 'true'
              })
              .returning('*');

            await trx('shop_products').insert({
              product_id: newProduct.id,
              shop_id: shopId,
              sku: cleanRow.sku,
              barcode: cleanRow.barcode || null,
              retail_price: numericFields.retail_price,
              wholesale_price: cleanRow.wholesale_price ? Number(cleanRow.wholesale_price) : null,
              purchase_price: cleanRow.purchase_price ? Number(cleanRow.purchase_price) : null,
              stock: numericFields.stock
            });

            // FIX 4: Increment created count
            results.created++;
          }
        } catch (rowError) {
          results.errors.push(`Row ${rowNumber}: ${rowError.message}`);
        }
      }
    });

    // Cleanup file
    if (fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
    }

    // Response handling
    if (results.errors.length > 0) {
      res.status(207).json({
        message: 'Completed with some errors',
        ...results
      });
    } else {
      res.status(201).json({
        message: 'All products processed successfully',
        ...results
      });
    }

  } catch (error) {
    // Cleanup file if exists
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
    }

    console.error('Bulk Upload Error:', {
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({
      error: 'Bulk processing failed',
      details: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};