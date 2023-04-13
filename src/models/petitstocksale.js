'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PetitStockSale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.PetitStockSaleDetail, { foreignKey: 'petitStockSaleId'})
    }
  }
  PetitStockSale.init({
    date: DataTypes.DATE,
    petiStockId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PetitStockSale',
  });
  return PetitStockSale;
};