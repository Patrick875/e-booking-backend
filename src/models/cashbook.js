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
      this.belongsTo(models.User, { foreignKey : 'doneTo'})
      this.belongsTo(models.User, { foreignKey : 'doneBy'})
    }
  }
  CashBook.init({
    prevBalance: DataTypes.FLOAT,
    newBalance: DataTypes.FLOAT,
    date: DataTypes.DATEONLY,
    description: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    accountType: DataTypes.ENUM('DEBIT', 'CREDIT'),
    doneBy: DataTypes.INTEGER,
    doneTo: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CashBook',
  });
  return CashBook;
};