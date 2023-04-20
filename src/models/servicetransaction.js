'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServiceTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo( models.User, { foreignKey : 'userId' } )
      // this.belongsTo( models.Service, { foreignKey : 'serviceId'})
    }
  }
  ServiceTransaction.init({
    client_name: DataTypes.STRING,
    serviceId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    total: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'ServiceTransaction',
  });
  return ServiceTransaction;
};