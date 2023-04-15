'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await Promise.all([
      queryInterface.addColumn('CashBooks', 'prevBalance', {
        type: Sequelize.FLOAT,
        allowNull: false
      }),
      queryInterface.addColumn('CashBooks', 'newBalance', {
        type: Sequelize.FLOAT,
        allowNull: false
      })
    ]);
  
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await Promise.all([
      queryInterface.removeColumn('CashBooks', 'prevBalance'),
      queryInterface.removeColumn('CashBooks', 'newBalance'),
    ]);
  }
};
