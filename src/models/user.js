'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Role, {foreignKey : 'roleId'});
      User.hasMany(models.Reservation, {foreignKey : 'userId'});

    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    verifiedAT: DataTypes.DATE,
    refreshToken: DataTypes.BLOB,
    roleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  });
  return User;
};