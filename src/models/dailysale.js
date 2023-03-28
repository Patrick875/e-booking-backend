'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailySale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DailySale.init({
    amount: DataTypes.DECIMAL(10, 2),
    expected: DataTypes.DECIMAL(10, 2),
    DepartmentId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DailySale',
  });
  return DailySale;
};