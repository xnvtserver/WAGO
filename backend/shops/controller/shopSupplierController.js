import db from "../../config/db.js";

    // Add supplier for shop
    export const addSupplierForShop= async (req, res) => {
        try {
            const { shopId, companyId } = req;
            const { name, contact_email, contact_phone, address } = req.body;
            
            // Check for existing supplier
            const existingSupplier = await db('suppliers')
                .where({ company_id: companyId, name })
                .first();
            
            if (existingSupplier) {
                return res.status(400).json({ error: 'Supplier already exists for this company' });
            }
            
            // Create new supplier
            const [supplier] = await db('suppliers').insert({
                company_id: companyId,
                name,
                contact_email,
                contact_phone,
                address: JSON.stringify(address)
            }).returning('*');
            
            res.status(201).json(supplier);
        } catch (error) {
            res.status(500).json({ error: 'Failed to add supplier' });
        }
    };

    // List suppliers for shop
    export const listSuppliersForShop= async (req, res) => {
        try {
            const { companyId } = req;
            const { search } = req.query;
            
            let query = db('suppliers').where({ company_id: companyId });
            
            if (search) {
                query = query.where('name', 'ilike', `%${search}%`);
            }
            
            const suppliers = await query.orderBy('name', 'asc');
            res.json(suppliers);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch suppliers' });
        }
    };

    // Get supplier details
    export const getSupplierDetailsForShop= async (req, res) => {
        try {
            const { companyId } = req;
            const { supplierId } = req.params;
            
            const supplier = await db('suppliers')
                .where({ id: supplierId, company_id: companyId })
                .first();
            
            if (!supplier) {
                return res.status(404).json({ error: 'Supplier not found' });
            }
            
            res.json(supplier);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch supplier details' });
        }
    };

    // Update supplier
    export const updateSupplierFromShop= async (req, res) => {
        try {
            const { companyId } = req;
            const { supplierId } = req.params;
            const updateData = req.body;
            
            const supplier = await db('suppliers')
                .where({ id: supplierId, company_id: companyId })
                .first();
            
            if (!supplier) {
                return res.status(404).json({ error: 'Supplier not found' });
            }
            
            // Prevent changing company association
            if (updateData.company_id && updateData.company_id !== companyId) {
                return res.status(403).json({ error: 'Cannot change company association' });
            }
            
            // Update supplier
            const [updatedSupplier] = await db('suppliers')
                .where({ id: supplierId })
                .update(updateData)
                .returning('*');
            
            res.json(updatedSupplier);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update supplier' });
        }
    };

    // Delete supplier (soft delete)
    export const deleteSupplierFromShop= async (req, res) => {
        try {
            const { companyId } = req;
            const { supplierId } = req.params;
            
            // Check for existing purchase orders
            const existingPOs = await db('purchase_orders')
                .where({ supplier_id: supplierId })
                .first();
            
            if (existingPOs) {
                return res.status(400).json({ 
                    error: 'Cannot delete supplier with existing purchase orders' 
                });
            }
            
            // Soft delete implementation
            const [deletedSupplier] = await db('suppliers')
                .where({ id: supplierId, company_id: companyId })
                .update({ is_active: false })
                .returning('*');
            
            if (!deletedSupplier) {
                return res.status(404).json({ error: 'Supplier not found' });
            }
            
            res.json({ message: 'Supplier deactivated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete supplier' });
        }
    };

    // List POs for supplier by shop
    export const listPurchaseOrdersForSupplierByShop= async (req, res) => {
        try {
            const { shopId } = req;
            const { supplierId } = req.params;
            const { status } = req.query;
            
            let query = db('purchase_orders')
                .where({ shop_id: shopId, supplier_id: supplierId });
            
            if (status) {
                query = query.where({ status });
            }
            
            const purchaseOrders = await query
                .orderBy('created_at', 'desc');
            
            res.json(purchaseOrders);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch purchase orders' });
        }
    };
