"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("DailyMoneyDetails", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			amount: {
				type: Sequelize.FLOAT,
			},
			currency: {
				type: Sequelize.STRING,
			},
			carriedBy: {
				type: Sequelize.INTEGER,
			},
			paymentMethod: {
				type: Sequelize.STRING,
			},
			dailysalesId: {
				type: Sequelize.INTEGER,
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
		await queryInterface.dropTable("DailyMoneyDetails");
	},
};
