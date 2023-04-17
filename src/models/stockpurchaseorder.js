'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockPurchaseOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.StockPurchaseOrderDetail, { foreignKey: 'stockPurchaseOrderId' })
    }
  }
  StockPurchaseOrder.init({
    
    date: DataTypes.DATE,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'PENDING',

    },
    userId: DataTypes.INTEGER,
    total: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StockPurchaseOrder',
    tableName: 'StockPurchaseOrders'
  });
  return StockPurchaseOrder;
};