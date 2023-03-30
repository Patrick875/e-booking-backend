'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockReceiveVoucherDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  
  StockReceiveVoucherDetail.init({
    stockItemId: DataTypes.INTEGER,
    stockReceiveVoucherId: DataTypes.INTEGER,
    receivedQuantity: DataTypes.INTEGER,
    unitPrice: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'StockReceiveVoucherDetail',
  });
  return StockReceiveVoucherDetail;
};