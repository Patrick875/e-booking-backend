'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PetitStockSaleDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      petitStockSaleId: {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'petitStockSales',
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        }
      },
      packageId: {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'Package',
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE'
        }
      },
      quantity: {
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
    await queryInterface.dropTable('PetitStockSaleDetails');
  }
};