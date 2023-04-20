'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyCash extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo( models.User, { foreignKey : 'carriedBy' } )
      this.belongsTo( models.User, { foreignKey : 'receivedBy'})
    }
  }
  DailyCash.init({
    amount: DataTypes.DECIMAL(10, 2),
    paymentMethod: DataTypes.DECIMAL(10, 2),
    currency: DataTypes.STRING,
    date: DataTypes.DATE,
    title: DataTypes.STRING,
    carriedBy: DataTypes.INTEGER,
    receivedBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'DailyCash',
  });
  return DailyCash;
};