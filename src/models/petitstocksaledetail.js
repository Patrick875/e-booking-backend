'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PetitStockSaleDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.PetitStockSale, { foreignKey: 'petitStockSaleId' })
      this.belongsTo(models.Product, { foreignKey: 'productId' })
      this.belongsTo(models.Package, { foreignKey: 'packageId' })
    }
  }
  PetitStockSaleDetail.init({
    petitStockSaleId: DataTypes.INTEGER,
    packageId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PetitStockSaleDetail',
  });
  return PetitStockSaleDetail;
};