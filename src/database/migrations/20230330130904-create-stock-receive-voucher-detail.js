'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StockReceiveVoucherDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stockItemId: {
        type: Sequelize.INTEGER
      },
      stockReceiveVoucherId: {
        type: Sequelize.INTEGER
      },
      receivedQuantity: {
        type: Sequelize.INTEGER
      },
      unitPrice: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('StockReceiveVoucherDetails');
  }
};