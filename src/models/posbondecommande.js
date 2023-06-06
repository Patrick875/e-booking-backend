"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class PosBonDeCommande extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.hasMany(models.PosbondecommandeDetail, {
				foreignKey: "posbondecommandeId",
			});
			this.belongsTo(models.PetitStock, {
				foreignKey: "petiStockId",
			});
			this.belongsTo(models.User, {
				foreignKey: "userId",
			});
		}
	}
	PosBonDeCommande.init(
		{
			date: DataTypes.DATE,
			petiStockId: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
			amount: DataTypes.FLOAT,
			table: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Posbondecommande",
		}
	);
	return PosBonDeCommande;
};
