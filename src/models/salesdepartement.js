'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalesDepartement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SalesDepartement.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SalesDepartement',
  });
  return SalesDepartement;
};