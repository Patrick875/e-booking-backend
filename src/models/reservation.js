'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reservation.belongsTo(models.Room, {foreignKey: 'roomId'})
      Reservation.belongsTo(models.User, {foreignKey: 'UserId'})
    }
  }
  Reservation.init({
    checkIn: DataTypes.DATE,
    checkOut: DataTypes.DATE,
    roomId: DataTypes.INTEGER,
    customerId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    booking_date: DataTypes.DATE,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};