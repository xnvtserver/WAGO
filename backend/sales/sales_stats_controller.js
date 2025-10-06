import knex from '../db/knex.js';

export const getSalesStats = async (req, res) => {
  try {
    const { shop_id } = req.params;

    // 1. Total Sales
    const totalSalesResult = await knex('sales')
      .where({ shop_id })
      .sum('total_amount as total_sales')
      .first();

    // 2. Transactions
    const transactionsResult = await knex('sales')
      .where({ shop_id })
      .count('* as transactions')
      .first();

    // 3. Avg. Order Value
    const avgOrderValueResult = await knex('sales')
      .where({ shop_id })
      .avg('total_amount as avg_order_value')
      .first();

    // 4. Refunds (if you track refunds with document_type)
    const refundsResult = await knex('sales')
      .where({ shop_id })
      .andWhere('document_type', 'refund')  // use actual column if different
      .sum('total_amount as refunds')
      .first();

    res.json({
      totalSales: parseFloat(totalSalesResult.total_sales) || 0,
      transactions: parseInt(transactionsResult.transactions) || 0,
      avgOrderValue: parseFloat(avgOrderValueResult.avg_order_value) || 0,
      refunds: parseFloat(refundsResult.refunds) || 0,
    });
  } catch (err) {
    console.error("Sales stats error:", err);
    res.status(500).json({ error: "Failed to fetch sales stats" });
  }
};
