'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Package.belongsToMany(models.Product, {through: models.ProductPackage})
      Package.belongsTo(models.ProductCategory , {foreignKey: 'categoryId'})
    }
  }
  Package.init({
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    categoryId:DataTypes.INTEGER
    
  }, {
    sequelize,
    modelName: 'Package',
  });
  return Package;
};