import db from "../../config/db.js";


    // Assign product to shop
    export const assignProductToShop= async (req, res) => {
        try {
            const { shopId } = req;
            const { productId, sku, barcode, retail_price, wholesale_price, 
                purchase_price, stock, reorder_threshold } = req.body;
            
            // Check if product exists
            const product = await db('products').where({ id: productId }).first();
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            
            // Check for unique SKU in shop
            const existingSKU = await db('shop_products')
                .where({ shop_id: shopId, sku })
                .first();
            
            if (existingSKU) {
                return res.status(400).json({ error: 'SKU must be unique within shop' });
            }
            
            // Check for unique barcode in shop
            const existingBarcode = await db('shop_products')
                .where({ shop_id: shopId, barcode })
                .first();
            
            if (existingBarcode) {
                return res.status(400).json({ error: 'Barcode must be unique within shop' });
            }
            
            // Create shop product
            const [shopProduct] = await db('shop_products').insert({
                shop_id: shopId,
                product_id: productId,
                sku,
                barcode,
                retail_price,
                wholesale_price,
                purchase_price,
                stock,
                reorder_threshold,
                status: 'active'
            }).returning('*');
            
            res.status(201).json(shopProduct);
        } catch (error) {
            res.status(500).json({ error: 'Failed to assign product to shop' });
        }
    };

    // Get shop product details
    export const getShopProductDetails= async (req, res) => {
        try {
            const { shopId } = req;
            const { shopProductId } = req.params;
            
            const shopProduct = await db('shop_products')
                .where({ id: shopProductId, shop_id: shopId })
                .first();
            
            if (!shopProduct) {
                return res.status(404).json({ error: 'Shop product not found' });
            }
            
            res.json(shopProduct);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch shop product details' });
        }
    };

    // Update shop product details
    export const updateShopProductDetails= async (req, res) => {
        try {
            const { shopId } = req;
            const { shopProductId } = req.params;
            const updateData = req.body;
            
            // Prevent changing core identifiers
            if (updateData.sku || updateData.barcode) {
                return res.status(400).json({ 
                    error: 'SKU and barcode cannot be modified' 
                });
            }
            
            const [updatedProduct] = await db('shop_products')
                .where({ id: shopProductId, shop_id: shopId })
                .update(updateData)
                .returning('*');
            
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Shop product not found' });
            }
            
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update shop product' });
        }
    };

    // Update stock level
    export const updateShopProductStock= async (req, res) => {
        try {
            const { shopId } = req;
            const { shopProductId } = req.params;
            const { newStockLevel, reason } = req.body;
            
            const shopProduct = await db('shop_products')
                .where({ id: shopProductId, shop_id: shopId })
                .first();
            
            if (!shopProduct) {
                return res.status(404).json({ error: 'Shop product not found' });
            }
            
            // Update stock
            await db('shop_products')
                .where({ id: shopProductId })
                .update({ stock: newStockLevel });
            
            // Record stock adjustment
            await db('inventory_adjustments').insert({
                shop_product_id: shopProductId,
                old_stock: shopProduct.stock,
                new_stock: newStockLevel,
                reason: reason || 'Manual adjustment',
                adjusted_by: req.user.id
            });
            
            res.json({ message: 'Stock updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update stock' });
        }
    };

    // List shop products
    export const listShopProducts= async (req, res) => {
        try {
            const { shopId } = req;
            const { lowStock, category } = req.query;
            
            let query = db('shop_products as sp')
                .join('products as p', 'sp.product_id', 'p.id')
                .select(
                    'sp.*', 
                    'p.name', 
                    'p.description', 
                    'p.category', 
                    'p.brand', 
                    'p.unit'
                )
                .where('sp.shop_id', shopId)
                .where('sp.status', 'active');
            
            if (lowStock === 'true') {
                query = query.whereRaw('sp.stock < sp.reorder_threshold');
            }
            
            if (category) {
                query = query.where('p.category', category);
            }
            
            const products = await query;
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch shop products' });
        }
    };

    // Remove product from shop
    export const removeProductFromShop= async (req, res) => {
        try {
            const { shopId } = req;
            const { shopProductId } = req.params;
            
            const result = await db('shop_products')
                .where({ id: shopProductId, shop_id: shopId })
                .update({ status: 'discontinued' });
            
            if (!result) {
                return res.status(404).json({ error: 'Shop product not found' });
            }
            
            res.json({ message: 'Product removed from shop successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to remove product from shop' });
        }
    };

    // Get price history
    export const getShopProductPriceHistory= async (req, res) => {
        try {
            const { shopId } = req;
            const { shopProductId } = req.params;
            const { priceType } = req.query;
            
            let query = db('price_history')
                .where({ shop_product_id: shopProductId });
            
            if (priceType) {
                query = query.where({ price_type: priceType });
            }
            
            const history = await query
                .orderBy('created_at', 'desc');
            
            res.json(history);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch price history' });
        }
    };
