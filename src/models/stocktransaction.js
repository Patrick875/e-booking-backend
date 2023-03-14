'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StockTransaction.init({
    transaction_date: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    status: DataTypes.ENUM('STOCK_IN', 'STOCK_OUT')
  }, {
    sequelize,
    modelName: 'StockTransaction',
  });
  return StockTransaction;
};