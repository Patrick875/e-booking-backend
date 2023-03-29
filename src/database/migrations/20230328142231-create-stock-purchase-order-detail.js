'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StockPurchaseOrderDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stockItemId: {
        type: Sequelize.INTEGER
      },
      stockPurchaseOrderId: {
        type: Sequelize.INTEGER
      },
      currentQuantity: {
        type: Sequelize.INTEGER
      },
      requestQuantity: {
        type: Sequelize.INTEGER
      },
      unitPrice: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('StockPurchaseOrderDetails');
  }
};