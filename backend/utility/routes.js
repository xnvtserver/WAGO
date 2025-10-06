import express from 'express';
import db from '../db/knex.js';

const router = express.Router();

// GET /shops/:id/upi
router.get('/shops/:id/upi', async (req, res) => {
  const { id } = req.params;

  try {
    const shop = await db('shops')
      .select('upi_id')
      .where({ id })
      .first();

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json({ upi_id: shop.upi_id });
  } catch (err) {
    console.error('Error fetching UPI ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
