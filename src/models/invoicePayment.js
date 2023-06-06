"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class InvoicePayment extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.Invoiced, { foreignKey: "invoiceId" });
			this.belongsTo(models.User, { foreignKey: "userId" });
		}
	}
	InvoicePayment.init(
		{
			paymentIdenfication: DataTypes.STRING,
			amount: DataTypes.FLOAT,
			paymentMethod: DataTypes.STRING,
			userId: DataTypes.INTEGER,
			invoiceId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "InvoicePayment",
		}
	);
	return InvoicePayment;
};
