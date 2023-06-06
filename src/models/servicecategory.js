"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ServiceCategory extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			ServiceCategory.hasOne(models.Service, {
				foreignKey: "service_categoryId",
			});
			ServiceCategory.hasMany(models.ServiceTransaction, {
				foreignKey: "service_categoryId",
			});
		}
	}
	ServiceCategory.init(
		{
			name: DataTypes.STRING,
			status: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "ServiceCategory",
		}
	);
	return ServiceCategory;
};
