import db from "../../config/db.js";

// Create purchase order
export const createShopPurchaseOrder = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const { supplierId, notes } = req.body; // Items handled separately

        const [purchaseOrder] = await db('purchase_orders').insert({
            shop_id: shopId,
            supplier_id: supplierId,
            status: 'draft',
            total_amount: 0, // Initial 0, updated when items added
            notes
        }).returning('*');

        res.status(201).json(purchaseOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create purchase order' });
    }
};

// Get PO details
export const getShopPurchaseOrderDetails = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const poId = req.params.poId;

        const purchaseOrder = await db('purchase_orders')
            .where({ id: poId, shop_id: shopId })
            .first();

        if (!purchaseOrder) {
            return res.status(404).json({ error: 'Purchase order not found' });
        }

        const supplier = await db('suppliers')
            .where({ id: purchaseOrder.supplier_id })
            .first();

        const items = await db('purchase_order_items as poi')
            .join('products as p', 'poi.product_id', 'p.id')
            .select('poi.*', 'p.name as product_name', 'p.barcode')
            .where('poi.purchase_order_id', poId);

        res.json({
            ...purchaseOrder,
            supplier,
            items
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch purchase order' });
    }
};

// Update PO status
export const updateShopPurchaseOrderStatus = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const poId = req.params.poId;
        const { status } = req.body;

        const validStatuses = ['draft', 'ordered', 'received', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const [updatedPO] = await db('purchase_orders')
            .where({ id: poId, shop_id: shopId })
            .update({ status })
            .returning('*');

        if (!updatedPO) {
            return res.status(404).json({ error: 'Purchase order not found' });
        }

        res.json(updatedPO);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update purchase order status' });
    }
};

// Add items to PO
export const addItemsToShopPurchaseOrder = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const poId = req.params.poId;
        const { items } = req.body;

        // Verify PO exists and is editable
        const purchaseOrder = await db('purchase_orders')
            .where({ id: poId, shop_id: shopId, status: 'draft' })
            .first();

        if (!purchaseOrder) {
            return res.status(404).json({
                error: 'Purchase order not found or not editable'
            });
        }
        // Frontend when adding items
        const itemsToSend = selectedItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.unit_price
        }));

        axios.post(
            `/v1/shops/${shopId}/purchase-orders/${poId}/items`,
            { items: itemsToSend }
        );
        // Add new items
        const poItems = items.map(item => ({
            purchase_order_id: poId,
            product_id: item.productId,
            quantity: item.quantity,
            unit_price: item.unitPrice
        }));

        await db('purchase_order_items').insert(poItems);

        // Recalculate total
        const totalResult = await db('purchase_order_items')
            .where('purchase_order_id', poId)
            .sum(db.raw('quantity * unit_price as total'))
            .first();

        await db('purchase_orders')
            .where({ id: poId })
            .update({ total_amount: totalResult.total });

        const updatedPO = await db('purchase_orders')
            .where({ id: poId })
            .first();

        res.json(updatedPO);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add items to purchase order' });
    }
};

// Receive PO items
export const receiveShopPurchaseOrderItems = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const poId = req.params.poId;
        const { receivedItems } = req.body;

        // Verify PO exists and is in ordered status
        const purchaseOrder = await db('purchase_orders')
            .where({ id: poId, shop_id: shopId, status: 'ordered' })
            .first();

        if (!purchaseOrder) {
            return res.status(404).json({
                error: 'Purchase order not found or not ready for receiving'
            });
        }

        // Process received items
        for (const item of receivedItems) {
            // Update PO item received quantity
            await db('purchase_order_items')
                .where({ id: item.poItemId })
                .increment('received_quantity', item.receivedQuantity);

            // Update shop product stock
            await db('shop_products')
                .where({
                    shop_id: shopId,
                    product_id: item.productId
                })
                .increment('stock', item.receivedQuantity);
        }

        // Update PO status
        const pendingItems = await db('purchase_order_items')
            .where('purchase_order_id', poId)
            .whereRaw('quantity > received_quantity');

        const newStatus = pendingItems.length === 0 ? 'received' : 'partially_received';
        await db('purchase_orders')
            .where({ id: poId })
            .update({ status: newStatus });

        const updatedPO = await db('purchase_orders')
            .where({ id: poId })
            .first();

        res.json(updatedPO);
    } catch (error) {
        res.status(500).json({ error: 'Failed to receive purchase order items' });
    }
};

// List shop POs
export const listShopPurchaseOrders = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const { status } = req.query;

        let query = db('purchase_orders as po')
            .join('suppliers as s', 'po.supplier_id', 's.id')
            .select('po.*', 's.name as supplier_name')
            .where({ 'po.shop_id': shopId });

        if (status && status !== 'all') {
            query = query.where({ status });
        }

        const purchaseOrders = await query
            .orderBy('po.created_at', 'desc')
            .select('po.*', 's.id as supplier_id', 's.name as supplier_name');
        
        res.json(purchaseOrders.map(po => ({
            ...po,
            supplier: {
                id: po.supplier_id,
                name: po.supplier_name || 'Unknown Supplier'
            }
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch purchase orders' });
    }
};

// Update PO header
export const updateShopPurchaseOrder = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const poId = req.params.poId;
        const { supplierId, notes } = req.body;

        const [updatedPO] = await db('purchase_orders')
            .where({ id: poId, shop_id: shopId })
            .update({
                supplier_id: supplierId,
                notes
            })
            .returning('*');

        if (!updatedPO) {
            return res.status(404).json({ error: 'Purchase order not found' });
        }

        res.json(updatedPO);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update purchase order' });
    }
};