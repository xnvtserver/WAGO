import { sequelize } from '../models/index.js';

export const createPriceHistory = async (data) => {
  return sequelize.models.PriceHistory.create(data);
};

export const getPriceHistory = async (productId, shopId) => {
  return sequelize.models.PriceHistory.findAll({
    where: { product_id: productId, shop_id: shopId },
    order: [['created_at', 'DESC']]
  });
};