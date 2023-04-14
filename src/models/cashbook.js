'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CashBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CashBook.init({
    date: DataTypes.DATEONLY,
    description: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    accountType: DataTypes.ENUM('debit', 'credit'),
    doneBy: DataTypes.INTEGER,
    doneTo: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CashBook',
  });
  return CashBook;
};