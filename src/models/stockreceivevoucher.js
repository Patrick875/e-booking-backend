'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockReceiveVoucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.StockPurchaseOrder, { foreignKey: 'stockPurchaseOrderId' })
      this.belongsTo(models.User, { foreignKey: 'userId'})
      this.hasOne(models.StockReceiveVoucherDetail, { foreignKey: 'stockReceiveVoucherId' })

    }
  }
  StockReceiveVoucher.init({

    date: DataTypes.DATE,
    status: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    stockPurchaseOrderId: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'StockReceiveVoucher',
  });
  return StockReceiveVoucher;
};