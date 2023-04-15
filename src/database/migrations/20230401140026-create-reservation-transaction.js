'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReservationTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      paymentMethod: {
        type: Sequelize.STRING
      },
      currency: {
        type: Sequelize.STRING
      },
      reservationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Reservations',
          key : 'id',
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ReservationTransactions');
  }
};