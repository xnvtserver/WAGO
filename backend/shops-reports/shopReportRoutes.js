// routes/shopReportRoutes.js
import express from 'express';
const router = express.Router();
import {  generateGSTR1, generateGSTR3BSummary, generateHSNSummary, generateInputTaxCreditReport,generateDailySalesReport,generateSalesByCategoryReport,generateInventoryValuation,generateLowStockReport,generateStockMovementReport} from './shopReportController';
import { generateEInvoice, generateEWaybill, getAuditLogs} from './shopComplianceController';

// GST Reports
router.get('/shops/:shopId/reports/gstr1', generateGSTR1);
router.get('/shops/:shopId/reports/gstr3b-summary', generateGSTR3BSummary);
router.get('/shops/:shopId/reports/hsn-summary', generateHSNSummary);
router.get('/shops/:shopId/reports/input-tax-credit', generateInputTaxCreditReport);

// Sales Reports
router.get('/shops/:shopId/reports/daily-sales', generateDailySalesReport);
router.get('/shops/:shopId/reports/sales-by-category', generateSalesByCategoryReport);

// Inventory Reports
router.get('/shops/:shopId/reports/inventory-valuation', generateInventoryValuation);
router.get('/shops/:shopId/reports/low-stock', generateLowStockReport);
router.get('/shops/:shopId/reports/stock-movement', generateStockMovementReport);

// Compliance Actions
router.post('/shops/:shopId/compliance/generate-e-invoice', generateEInvoice);
router.post('/shops/:shopId/compliance/generate-e-waybill', generateEWaybill);
router.get('/shops/:shopId/compliance/audit-logs', getAuditLogs);

module.exports = router;