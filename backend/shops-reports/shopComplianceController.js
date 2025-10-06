import db from "../../config/db.js";
import axios from 'axios'; // For external API calls

  // Generate E-Invoice
  export const generateEInvoice = async(req, res) => {
    try {
      const { shopId } = req;
      const { saleId } = req.body;
      
      // Get sale details
      const sale = await db('sales')
        .where({ id: saleId, shop_id: shopId })
        .first();
      
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }
      
      // Get line items
      const items = await db('sale_items')
        .where('sale_id', saleId);
      
      // Prepare e-invoice payload
      const eInvoicePayload = {
        Version: "1.1",
        TranDtls: {
          TaxSch: "GST",
          SupTyp: "B2B",
          RegRev: sale.is_reverse_charge ? "Y" : "N",
          EcmGstin: null,
          IgstOnIntra: sale.supply_type === 'inter_state' ? "Y" : "N"
        },
        DocDtls: {
          Typ: sale.document_type === 'invoice' ? "INV" : "CRN",
          No: sale.invoice_number,
          Dt: sale.sale_date.toISOString().split('T')[0]
        },
        SellerDtls: {
          Gstin: req.shop.gstin,
          LglNm: req.shop.name,
          Addr1: req.shop.location,
          Loc: req.shop.location.split(',')[0],
          Pin: parseInt(req.shop.location.split(',').pop().trim()) || 0,
          Stcd: req.shop.location.split(',')[1]?.trim() || ""
        },
        BuyerDtls: {
          Gstin: sale.customer_gstin,
          LglNm: sale.customer_name,
          Pos: sale.supply_type === 'inter_state' ? "96" : "09", // 96: Other Territory, 09: State code
          Addr1: sale.shipping_address?.address_line1,
          Loc: sale.shipping_address?.city,
          Pin: parseInt(sale.shipping_address?.pincode) || 0,
          Stcd: sale.shipping_address?.state_code || ""
        },
        ItemList: items.map(item => ({
          SlNo: "1",
          PrdDesc: item.product_name,
          HsnCd: item.hsn_sac_code,
          Qty: item.quantity,
          Unit: "PCS",
          UnitPrice: item.unit_price,
          TotAmt: item.taxable_value,
          Discount: item.discount_per_item,
          AssAmt: item.taxable_value - item.discount_per_item,
          GstRt: item.gst_rate_percentage,
          IgstAmt: item.igst_amount_per_item,
          CgstAmt: item.cgst_amount_per_item,
          SgstAmt: item.sgst_amount_per_item,
          CesRt: 0,
          CesAmt: 0,
          CesNonAdvlAmt: 0,
          StateCesRt: 0,
          StateCesAmt: 0,
          StateCesNonAdvlAmt: 0,
          OthChrg: 0,
          TotItemVal: item.total_item_amount
        })),
        ValDtls: {
          AssVal: sale.total_taxable_value,
          CgstVal: sale.total_cgst_amount,
          SgstVal: sale.total_sgst_amount,
          IgstVal: sale.total_igst_amount,
          CesVal: sale.total_cess_amount,
          StCesVal: 0,
          Discount: sale.total_discount_amount,
          OthChrg: 0,
          RndOffAmt: 0,
          TotInvVal: sale.total_amount
        }
      };
      
      // Call GSTN E-Invoice API (mock implementation)
      const response = await axios.post('https://gstn-einvoice-api.com/generate', eInvoicePayload);
      
      // Save IRN (Invoice Reference Number)
      await db('sales')
        .where({ id: saleId })
        .update({ 
          e_invoice_irn: response.data.Irn,
          e_invoice_qr_code: response.data.QRCode
        });
      
      res.json({
        message: 'E-Invoice generated successfully',
        irn: response.data.Irn,
        qr_code: response.data.QRCode
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate E-Invoice' });
    }
  };

  // Generate E-Waybill
  export const generateEWaybill = async(req, res) => {
    try {
      const { shopId } = req;
      const { saleId, transportDetails } = req.body;
      
      // Get sale details
      const sale = await db('sales')
        .where({ id: saleId, shop_id: shopId })
        .first();
      
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }
      
      // Prepare e-waybill payload
      const eWaybillPayload = {
        supply_type: sale.supply_type,
        sub_supply_type: "Supply",
        doc_type: sale.document_type === 'invoice' ? "INV" : "CRN",
        doc_no: sale.invoice_number,
        doc_date: sale.sale_date.toISOString().split('T')[0],
        from_gstin: req.shop.gstin,
        from_trd_name: req.shop.name,
        from_addr1: req.shop.location,
        from_place: req.shop.location.split(',')[0],
        from_pincode: parseInt(req.shop.location.split(',').pop().trim()) || 0,
        from_state_code: req.shop.location.split(',')[1]?.trim() || "",
        to_gstin: sale.customer_gstin,
        to_trd_name: sale.customer_name,
        to_addr1: sale.shipping_address?.address_line1,
        to_place: sale.shipping_address?.city,
        to_pincode: parseInt(sale.shipping_address?.pincode) || 0,
        to_state_code: sale.shipping_address?.state_code || "",
        trans_mode: transportDetails.mode,
        trans_distance: transportDetails.distance,
        transporter_id: transportDetails.transporter_id,
        transporter_name: transportDetails.name,
        vehicle_no: transportDetails.vehicle_number,
        vehicle_type: transportDetails.vehicle_type,
        item_list: (await db('sale_items').where('sale_id', saleId)).map(item => ({
          product_name: item.product_name,
          hsn_code: item.hsn_sac_code,
          quantity: item.quantity,
          taxable_value: item.taxable_value
        }))
      };
      
      // Call GSTN E-Waybill API (mock implementation)
      const response = await axios.post('https://gstn-ewaybill-api.com/generate', eWaybillPayload);
      
      // Save E-Waybill details
      await db('sales')
        .where({ id: saleId })
        .update({ 
          e_waybill_number: response.data.ewayBillNo,
          e_waybill_valid_until: response.data.validUntil
        });
      
      res.json({
        message: 'E-Waybill generated successfully',
        e_waybill_number: response.data.ewayBillNo,
        valid_until: response.data.validUntil
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate E-Waybill' });
    }
  };

  // Get Audit Logs
  export const getAuditLogs = async(req, res) => {
    try {
      const { shopId } = req;
      const { startDate, endDate, actionType } = req.query;
      
      let query = db('audit_logs')
        .where('shop_id', shopId);
      
      if (startDate && endDate) {
        query = query.whereBetween('action_timestamp', [startDate, endDate]);
      }
      
      if (actionType) {
        query = query.where('action_type', actionType);
      }
      
      const logs = await query.orderBy('action_timestamp', 'desc');
      
      res.json({
        shop_id: shopId,
        audit_logs: logs
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
 };
