import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('PriceHistory', {
    price_type: DataTypes.ENUM('retail', 'wholesale', 'purchase'),
    old_price: DataTypes.DECIMAL(10, 2),
    new_price: DataTypes.DECIMAL(10, 2)
  });
};