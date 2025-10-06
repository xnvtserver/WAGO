import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Product', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    is_active: DataTypes.BOOLEAN,
    category: DataTypes.STRING,
    brand: DataTypes.STRING,
    unit: DataTypes.STRING,
    unit_value: DataTypes.STRING,
    image: DataTypes.STRING
  });
};