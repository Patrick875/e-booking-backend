'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */ 
      await queryInterface.bulkInsert('Roles', [{
        name: 'administrator',
        display_name: 'Administrator',
        createdAt: new Date(),
        updatedAt: new Date(),

      },
      {
        name: 'cashier',
        display_name: 'Cashier',
        createdAt: new Date(),
        updatedAt: new Date(),


      },
      {
        name: 'receptionist',
        display_name: 'Receptionist',
        createdAt: new Date(),
        updatedAt: new Date(),


      },
      {
        name: 'stock-keeper',
        display_name: 'Stock keeper',
        createdAt: new Date(),
        updatedAt: new Date(),


      }
    ], {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
