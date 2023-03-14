'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockTransactionDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StockTransactionDetail.belongsTo(models.StockTransaction, {foreignKey : 'stockTransactionId'});
      StockTransactionDetail.belongsTo(models.StockItem, { foreignKey : 'stockItemId' });
    }
  }
  StockTransactionDetail.init({
    stockTransactionId: DataTypes.INTEGER,
    stockItemId: DataTypes.INTEGER,
    currentQuantity: DataTypes.INTEGER,
    transactionQuantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StockTransactionDetail',
  });
  return StockTransactionDetail;
};