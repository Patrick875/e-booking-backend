'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyMoneyDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo( models.DailyMoney , { foreignKey : 'dailysalesId'})
      this.belongsTo(models.User, { foreignKey : 'carriedBy' })
    }
  }
  DailyMoneyDetail.init({
    amount: DataTypes.FLOAT,
    currency: DataTypes.STRING,
    carriedBy: DataTypes.INTEGER,
    paymentMethod: DataTypes.STRING,
    dailysalesId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DailyMoneyDetail',
  });
  return DailyMoneyDetail;
};