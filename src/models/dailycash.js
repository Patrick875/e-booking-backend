'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyMoney extends Model {
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
  DailyMoney.init({
    amount: DataTypes.DECIMAL(10, 2),
    paymentMethod: DataTypes.STRING,
    currency: DataTypes.STRING,
    date: DataTypes.DATE,
    title: DataTypes.STRING,
    carriedBy: DataTypes.INTEGER,
    receivedBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'DailyMoney',
  });
  return DailyMoney;
};