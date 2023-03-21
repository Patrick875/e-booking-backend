'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hall extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Reservation, { foreignKey: 'hallId' });
    }
  }
  Hall.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    size: DataTypes.INTEGER,
    description: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Hall',
    tableName: 'Halls',
  });
  return Hall;
};