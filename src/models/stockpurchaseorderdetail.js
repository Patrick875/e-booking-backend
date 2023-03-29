'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockPurchaseOrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StockPurchaseOrderDetail.init({
    stockItemId: DataTypes.INTEGER,
    stockPurchaseOrderId: DataTypes.INTEGER,
    currentQuantity: DataTypes.INTEGER,
    requestQuantity: DataTypes.INTEGER,
    unitPrice: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StockPurchaseOrderDetail',
  });
  return StockPurchaseOrderDetail;
};