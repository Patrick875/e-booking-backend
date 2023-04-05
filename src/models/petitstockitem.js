'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PetitStockItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PetitStockItem.init({
    petitstockId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    quantinty: DataTypes.INTEGER,
    avgPrice: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'PetitStockItem',
  });
  return PetitStockItem;
};