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
      // this.belongsTo( models.User, {as: 'carrier', foreignKey : 'carriedBy' } )
      this.belongsTo( models.User, { as: 'receiver', foreignKey : 'receivedBy' } )
      this.hasMany( models.DailyMoneyDetail, { foreignKey : 'dailysalesId'})
    }
  }
  DailyMoney.init({
    date: DataTypes.DATE,
    totals : DataTypes.JSONB,
    receivedBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'DailyMoney',
  });
  return DailyMoney;
};