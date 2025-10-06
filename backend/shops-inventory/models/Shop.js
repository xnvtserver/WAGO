import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Shop = sequelize.define('Shop', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'needs-update'),
      defaultValue: 'active'
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: false,
    tableName: 'shops'
  });

  Shop.associate = (models) => {
    Shop.belongsTo(models.User, {
      foreignKey: 'owner_id',
      as: 'owner'
    });
    
    Shop.hasMany(models.ShopProduct, {
      foreignKey: 'shop_id',
      as: 'inventory'
    });

    Shop.hasMany(models.Promotion, {
      foreignKey: 'shop_id',
      as: 'promotions'
    });
  };

  return Shop;
};