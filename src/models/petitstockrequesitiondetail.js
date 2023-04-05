'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PetitStockRequesitionDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PetitStockRequesitionDetail.init({
    itemValueId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    petitStockrequestId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PetitStockRequesitionDetail',
  });
  return PetitStockRequesitionDetail;
};