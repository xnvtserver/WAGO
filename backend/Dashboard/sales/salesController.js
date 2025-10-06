import knex from '../../config/db.js';
// import { logger } from '../utils/logger.js';

export async function getSalesData(req, res) {
    console.log('&&&&&&&&&&&&&&&&&&&&&& GET SALES DATA CALLED &&&&&&&&&&&&&&&&');
  const { shop_id } = req.user; // From authentication middleware
  const { period = '30d', page = 1, limit = 10 } = req.query;

  try {
    if (!['24h', '7d', '30d', 'all'].includes(period)) {
      return res.status(400).json({ error: 'Invalid period parameter' });
    }

    const query = knex('sales')
      .where('shop_id', shop_id)
      .orderBy('sale_date', 'desc');

    if (period !== 'all') {
      const intervals = {
        '24h': 1,
        '7d': 7,
        '30d': 30
      };
      query.where('sale_date', '>=', 
        knex.raw(`now() - interval '${intervals[period]} day'`)
      );
    }

    const offset = (page - 1) * limit;
    const [sales, total] = await Promise.all([
      query.clone().offset(offset).limit(limit),
      query.clone().count('* as total')
    ]);

    const stats = await knex('sales')
      .where('shop_id', shop_id)
      .select(
        knex.raw('sum(total_amount) as total_sales'),
        knex.raw('avg(total_amount) as average_sale'),
        knex.raw('count(distinct date(sale_date)) as active_days')
      )
      .first();

    res.json({
      success: true,
      data: {
        meta: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total[0].total)
        },
        sales,
        stats: {
          total_sales: parseFloat(stats.total_sales) || 0,
          average_sale: parseFloat(stats.average_sale) || 0,
          active_days: stats.active_days
        }
      }
    });

  } catch (error) {
    // logger.error(`Sales data error: ${error.message}`);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch sales data'
    });
  }
}

// Optional additional exports
export async function getSalesTrends(req, res) {
  // Implementation here
}
