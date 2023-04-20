'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Service.belongsTo(models.ServiceCategory, {foreignKey : 'service_categoryId'});
      this.hasMany( models.ServiceTransaction, {foreignKey : 'serviceId'});
    }
  }

  Service.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    status: DataTypes.STRING,
    service_categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Service',
    tableName: 'Services',
  });

  return Service;
};