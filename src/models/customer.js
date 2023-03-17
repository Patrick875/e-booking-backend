'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Reservation, { foreignKey: 'customerId' });
    }
  }
  Customer.init({
    names: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    identification: DataTypes.STRING,
    status: DataTypes.STRING,
    customerType: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Customer',
    tableName: 'Customers',
  });
  return Customer;
};