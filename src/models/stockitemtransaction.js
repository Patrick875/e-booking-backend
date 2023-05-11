'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockItemTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.StockItemNew, { foreignKey : 'stockItem'} )
    }
  }
  StockItemTransaction.init({
    stockItem: DataTypes.INTEGER,
    preQuantity: DataTypes.INTEGER,
    newQuantity: DataTypes.INTEGER,
    balance: DataTypes.INTEGER,
    status: DataTypes.STRING,
    date: DataTypes.DATE,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'StockItemTransaction',
  });
  return StockItemTransaction;
};