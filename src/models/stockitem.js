'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockItemNew extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.StockPurchaseOrderDetail, { foreignKey: 'stockItemId' });
      this.hasOne(models.StockReceiveVoucherDetail, { foreignKey: 'stockItemId' });
      this.hasMany(models.StockItemValue, { foreignKey: 'stockItemId' } );
      this.hasMany(models.PetitStockItem, { foreignKey: 'itemId'} )
      this.hasMany(models.StockItemTransaction, { foreignKey: 'stockItem' } );
      this.belongsTo(models.Store, { foreignKey: 'storeId' });
      
    }
  }
  StockItemNew.init({
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    storeId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'StockItemNew',
    tableName: 'StockItemNews'
  });
  return StockItemNew;
};