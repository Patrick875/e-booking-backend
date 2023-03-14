'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StockTransactionDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stockTransactionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'StockTransactions',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      },
      stockItemId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      references: {
        model: 'StockItems',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
      },
      currentQuantity: {
        type: Sequelize.INTEGER
      },
      transactionQuantity: {
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
    await queryInterface.dropTable('StockTransactionDetails');
  }
};