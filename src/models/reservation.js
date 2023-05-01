"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Room, { foreignKey: "roomId" });
      this.belongsTo(models.Hall, { foreignKey: "hallId" });
      this.belongsTo(models.User, { foreignKey: "userId" });
      this.belongsTo(models.Customer, { foreignKey: "customerId" });
      this.hasMany(models.ReservationTransaction, { foreignKey: "reservationId"})
      this.belongsToMany(models.HallService, {
        through: models.ReservationService,
      });
      this.hasMany( models.PetitStockReservation, { foreignKey : 'reservationId'})

    }
  }
  Reservation.init(
    {
      checkIn: DataTypes.DATE,
      checkOut: DataTypes.DATE,
      roomId: DataTypes.INTEGER,
      hallId: DataTypes.INTEGER,
      customerId: DataTypes.INTEGER,
      details: DataTypes.JSONB,
      userId: DataTypes.INTEGER,
      amount: DataTypes.JSONB,
      payment:DataTypes.JSONB,
      booking_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      bookingId : DataTypes.STRING,
      payment_status: DataTypes.STRING,
      adults_number: DataTypes.INTEGER,
      children_number: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Reservation",
      tableName: "Reservations",
    }
  );
  return Reservation;
};
