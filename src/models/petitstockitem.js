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
      this.belongsTo(models.StockItemNew, { foreignKey : 'itemId' })
      this.belongsTo(models.PetitStock, { foreignKey: 'petitstockId' })
    }
  }
  PetitStockItem.init({
    petitstockId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    quantinty: DataTypes.INTEGER,
    unit: DataTypes.STRING,
    avgPrice: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'PetitStockItem',
  });
  return PetitStockItem;
};