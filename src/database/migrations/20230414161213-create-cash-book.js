'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CashBooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY
      },
      description: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.FLOAT
      },
      accountType: {
        type: Sequelize.ENUM('debit','credit')
      },
      doneBy: {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'Users',
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE'
        }
      },
      doneTo: {
        type: Sequelize.STRING,
       
      },
      status: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('CashBooks');
  }
};