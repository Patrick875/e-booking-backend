'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PetitStockRequesition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PetitStockRequesition.init({
    date: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'ACTIVE',
    },
    userId: DataTypes.INTEGER,
    total: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PetitStockRequesition',
  });
  return PetitStockRequesition;
};