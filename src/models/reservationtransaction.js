'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReservationTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Reservation, { foreignKey : 'reservationId'})
    }
  }
  
  ReservationTransaction.init({
    date: DataTypes.DATE,
    amount: DataTypes.DECIMAL,
    paymentMethod: DataTypes.STRING,
    currency: DataTypes.STRING,
    reservationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReservationTransaction',
    tableName: 'ReservationTransactions',
  });
  return ReservationTransaction;
};