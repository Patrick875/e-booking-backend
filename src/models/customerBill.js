"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class CustomerBill extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.hasMany(models.CustomerBillDetail, {
				foreignKey: "customerbillId",
			});
			this.belongsTo(models.PetitStock, {
				foreignKey: "petiStockId",
			});
			this.belongsTo(models.User, {
				foreignKey: "userId",
			});
		}
	}
	CustomerBill.init(
		{
			date: DataTypes.DATE,
			userId: DataTypes.INTEGER,
			amount: DataTypes.FLOAT,
			status: DataTypes.STRING,
			petiStockId: DataTypes.INTEGER,
			table: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "CustomerBill",
		}
	);
	return CustomerBill;
};
