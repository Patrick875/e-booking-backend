'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PetitStockReservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.PetitStockItem, { foreignKey: 'petitStockItemId'})
      this.belongsTo(models.PetitStock, { foreignKey: 'petitStockId'})
      this.belongsTo(models.Reservation, { foreignKey: 'reservationId'})
    }
  }
  PetitStockReservation.init({
    petitStockItemId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    unitPrice: DataTypes.FLOAT,
    status: DataTypes.STRING,
    reservationId: DataTypes.INTEGER,
    petitStockId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PetitStockReservation',
  });
  return PetitStockReservation;
};