const db = require('../db/knex');

  // Generate GSTR-1 Report
  export const generateGSTR1= async(req, res)=> {
    try {
      const { shopId } = req;
      const { period } = req.query; // Format: YYYY-MM
      
      const [year, month] = period.split('-');
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      // Fetch sales data
      const sales = await db('sales')
        .select(
          'invoice_number',
          'sale_date',
          'document_type',
          'total_taxable_value',
          'total_cgst_amount',
          'total_sgst_amount',
          'total_igst_amount',
          'total_cess_amount',
          'supply_type',
          'is_b2b',
          'customer_gstin'
        )
        .where('shop_id', shopId)
        .whereBetween('sale_date', [startDate, endDate]);
      
      // Fetch line items
      const lineItems = await db('sale_items as si')
        .join('sales as s', 'si.sale_id', 's.id')
        .select(
          'si.hsn_sac_code',
          'si.taxable_value',
          'si.cgst_amount_per_item',
          'si.sgst_amount_per_item',
          'si.igst_amount_per_item',
          'si.cess_amount_per_item',
          's.invoice_number'
        )
        .where('s.shop_id', shopId)
        .whereBetween('s.sale_date', [startDate, endDate]);
      
      res.json({
        period,
        shop_gstin: req.shop.gstin,
        summary: sales,
        line_items: lineItems
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate GSTR-1 report' });
    }
  };

  // Generate GSTR-3B Summary
  export const generateGSTR3BSummary= async(req, res)=> {
    try {
      const { shopId } = req;
      const { period } = req.query; // Format: YYYY-MM
      
      const [year, month] = period.split('-');
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      // Get tax liability from sales
      const taxLiability = await db('sales')
        .select(
          db.raw("SUM(total_taxable_value) as total_taxable_value"),
          db.raw("SUM(total_cgst_amount) as total_cgst"),
          db.raw("SUM(total_sgst_amount) as total_sgst"),
          db.raw("SUM(total_igst_amount) as total_igst"),
          db.raw("SUM(total_cess_amount) as total_cess")
        )
        .where('shop_id', shopId)
        .whereBetween('sale_date', [startDate, endDate])
        .first();
      
      // Get input tax credit from purchases
      const taxCredit = await db('purchase_order_items as poi')
        .join('purchase_orders as po', 'poi.purchase_order_id', 'po.id')
        .select(
          db.raw("SUM(poi.taxable_value) as total_taxable_value"),
          db.raw("SUM(poi.cgst_amount_per_item) as total_cgst"),
          db.raw("SUM(poi.sgst_amount_per_item) as total_sgst"),
          db.raw("SUM(poi.igst_amount_per_item) as total_igst"),
          db.raw("SUM(poi.cess_amount_per_item) as total_cess")
        )
        .where('po.shop_id', shopId)
        .whereBetween('po.created_at', [startDate, endDate])
        .first();
      
      res.json({
        period,
        shop_gstin: req.shop.gstin,
        tax_liability: taxLiability,
        input_tax_credit: taxCredit,
        net_tax_payable: {
          cgst: (taxLiability.total_cgst || 0) - (taxCredit.total_cgst || 0),
          sgst: (taxLiability.total_sgst || 0) - (taxCredit.total_sgst || 0),
          igst: (taxLiability.total_igst || 0) - (taxCredit.total_igst || 0),
          cess: (taxLiability.total_cess || 0) - (taxCredit.total_cess || 0)
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate GSTR-3B summary' });
    }
  };

  // Generate HSN Summary Report
  export const generateHSNSummary= async(req, res)=> {
    try {
      const { shopId } = req;
      const { period } = req.query;
      
      const [year, month] = period.split('-');
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const hsnSummary = await db('sale_items as si')
        .join('sales as s', 'si.sale_id', 's.id')
        .select(
          'si.hsn_sac_code',
          db.raw("SUM(si.quantity) as total_quantity"),
          db.raw("SUM(si.taxable_value) as total_value"),
          db.raw("SUM(si.cgst_amount_per_item) as total_cgst"),
          db.raw("SUM(si.sgst_amount_per_item) as total_sgst"),
          db.raw("SUM(si.igst_amount_per_item) as total_igst"),
          db.raw("SUM(si.cess_amount_per_item) as total_cess")
        )
        .where('s.shop_id', shopId)
        .whereNotNull('si.hsn_sac_code')
        .whereBetween('s.sale_date', [startDate, endDate])
        .groupBy('si.hsn_sac_code')
        .orderBy('si.hsn_sac_code');
      
      res.json({
        period,
        shop_gstin: req.shop.gstin,
        hsn_summary: hsnSummary
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate HSN summary' });
    }
  };

  // Generate Input Tax Credit Report
  export const generateInputTaxCreditReport= async(req, res)=> {
    try {
      const { shopId } = req;
      const { period } = req.query;
      
      const [year, month] = period.split('-');
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const itcReport = await db('purchase_order_items as poi')
        .join('purchase_orders as po', 'poi.purchase_order_id', 'po.id')
        .join('suppliers as s', 'po.supplier_id', 's.id')
        .select(
          's.name as supplier_name',
          's.gstin as supplier_gstin',
          'po.invoice_number',
          'po.invoice_date',
          'poi.hsn_sac_code',
          'poi.taxable_value',
          'poi.cgst_amount_per_item',
          'poi.sgst_amount_per_item',
          'poi.igst_amount_per_item',
          'poi.cess_amount_per_item'
        )
        .where('po.shop_id', shopId)
        .whereBetween('po.created_at', [startDate, endDate]);
      
      res.json({
        period,
        shop_gstin: req.shop.gstin,
        input_tax_credit: itcReport
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate input tax credit report' });
    }
  };

  // Generate Daily Sales Report
  export const generateDailySalesReport= async(req, res)=> {
    try {
      const { shopId } = req;
      const { date } = req.query; // Format: YYYY-MM-DD
      
      const sales = await db('sales')
        .select(
          'invoice_number',
          'sale_date',
          'total_taxable_value',
          'total_cgst_amount',
          'total_sgst_amount',
          'total_igst_amount',
          'total_amount',
          'payment_details'
        )
        .where('shop_id', shopId)
        .whereRaw('DATE(sale_date) = ?', [date]);
      
      res.json({
        date,
        shop_id: shopId,
        total_sales: sales.length,
        total_amount: sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0),
        details: sales
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate daily sales report' });
    }
  };

  // Generate Sales by Category Report
  export const generateSalesByCategoryReport= async(req, res)=> {
    try {
      const { shopId } = req;
      const { startDate, endDate } = req.query;
      
      const salesByCategory = await db('sale_items as si')
        .join('sales as s', 'si.sale_id', 's.id')
        .join('products as p', 'si.product_id', 'p.id')
        .select(
          'p.category',
          db.raw("SUM(si.quantity) as total_quantity"),
          db.raw("SUM(si.taxable_value) as total_sales"),
          db.raw("SUM(si.cgst_amount_per_item + si.sgst_amount_per_item + si.igst_amount_per_item) as total_tax")
        )
        .where('s.shop_id', shopId)
        .whereBetween('s.sale_date', [startDate, endDate])
        .groupBy('p.category')
        .orderBy('total_sales', 'desc');
      
      res.json({
        start_date: startDate,
        end_date: endDate,
        shop_id: shopId,
        sales_by_category: salesByCategory
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate category sales report' });
    }
  };

  // Generate Inventory Valuation Report
  export const generateInventoryValuation= async(req, res)=> {
    try {
      const { shopId } = req;
      
      const inventory = await db('shop_products as sp')
        .join('products as p', 'sp.product_id', 'p.id')
        .select(
          'p.name',
          'p.category',
          'sp.stock',
          'sp.purchase_price',
          db.raw('sp.stock * sp.purchase_price as value')
        )
        .where('sp.shop_id', shopId)
        .orderBy('value', 'desc');
      
      const totalValuation = inventory.reduce((sum, item) => 
        sum + (parseFloat(item.stock) * parseFloat(item.purchase_price), 0));
      
      res.json({
        shop_id: shopId,
        total_valuation: totalValuation,
        inventory
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate inventory valuation' });
    }
  };

  // Generate Low Stock Report
  export const generateLowStockReport= async(req, res)=> {
    try {
      const { shopId } = req;
      
      const lowStockItems = await db('shop_products as sp')
        .join('products as p', 'sp.product_id', 'p.id')
        .select(
          'p.name',
          'p.hsn_sac_code',
          'sp.stock',
          'sp.reorder_threshold',
          'p.category'
        )
        .where('sp.shop_id', shopId)
        .whereRaw('sp.stock < sp.reorder_threshold');
      
      res.json({
        shop_id: shopId,
        low_stock_items: lowStockItems
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate low stock report' });
    }
  };

  // Generate Stock Movement Report
  export const generateStockMovementReport= async(req, res)=> {
    try {
      const { shopId } = req;
      const { startDate, endDate } = req.query;
      
      // Get sales
      const sales = await db('sale_items as si')
        .join('sales as s', 'si.sale_id', 's.id')
        .select(
          'si.product_id',
          db.raw("SUM(si.quantity) as sold_quantity")
        )
        .where('s.shop_id', shopId)
        .whereBetween('s.sale_date', [startDate, endDate])
        .groupBy('si.product_id');
      
      // Get purchases
      const purchases = await db('purchase_order_items as poi')
        .join('purchase_orders as po', 'poi.purchase_order_id', 'po.id')
        .select(
          'poi.product_id',
          db.raw("SUM(poi.quantity) as purchased_quantity")
        )
        .where('po.shop_id', shopId)
        .whereBetween('po.created_at', [startDate, endDate])
        .groupBy('poi.product_id');
      
      // Get current stock
      const currentStock = await db('shop_products')
        .select('product_id', 'stock')
        .where('shop_id', shopId);
      
      // Combine data
      const stockMovement = currentStock.map(item => {
        const sold = sales.find(s => s.product_id === item.product_id)?.sold_quantity || 0;
        const purchased = purchases.find(p => p.product_id === item.product_id)?.purchased_quantity || 0;
        
        return {
          product_id: item.product_id,
          opening_stock: item.stock + sold - purchased,
          purchased,
          sold,
          closing_stock: item.stock
        };
      });
      
      res.json({
        start_date: startDate,
        end_date: endDate,
        shop_id: shopId,
        stock_movement: stockMovement
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate stock movement report' });
    }
  };