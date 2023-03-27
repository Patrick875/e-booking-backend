"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reservations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      checkIn: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      checkOut: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      booking_date: {
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        type: Sequelize.DATE,
      },
      payment_status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "PENDING",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,

      },
      payment: {
        type: Sequelize.DECIMAL(10, 2),
      },
      adults_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      children_number: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      details : {
        type: Sequelize.JSONB,
        allowNull : true

      },
      status: {
        defaultValue: "INROOM",
        type: Sequelize.STRING,
      },
      booking_type: {
        type: Sequelize.ENUM("ROOM", "HALL"),
        defaultValue: "ROOM",
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      customerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Customer",
          key: "id",
          onDelete: "RESTRICT",
          onUpdate: "CASCADE",
        },
      },
      roomId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Room",
          key: "id",
          onDelete: "RESTRICT",
          onUpdate: "CASCADE",
        },
      },
      hallId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Hall",
          key: "id",
          onDelete: "RESTRICT",
          onUpdate: "CASCADE",
        },
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "User",
          key: "id",
          onDelete: "RESTRICT",
          onUpdate: "CASCADE",
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Reservations");
  },
};
