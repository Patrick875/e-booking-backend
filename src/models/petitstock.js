'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PetitStock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    this.hasOne(models.PetitStockSale, { foreignKey: 'petiStockId'})
    this.hasMany(models.PetitStockItem , { foreignKey: 'petitstockId' })
    this.hasOne(models.PetitStockRequesition, { foreignKey: 'petitStockId' })
    }
  }
  PetitStock.init({
    name: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PetitStock',
  });
  return PetitStock;
};