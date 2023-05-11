'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockItemValue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.StockItemNew, { foreignKey : 'stockItemId'})
      this.hasMany(models.PetitStockRequesitionDetail, { foreignKey: 'itemValueId' });


    }
  }
  StockItemValue.init({
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    // unit: DataTypes.STRING,
    stockItemId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StockItemValue',
    tableName: 'StockItemValues',
  });
  return StockItemValue;
};