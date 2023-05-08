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
      this.hasMany( models.PetitStockRequesitionDetail, { foreignKey: 'petitStockrequestId' })
      this.belongsTo( models.User, { foreignKey: 'userId' })
      this.belongsTo(models.PetitStock, { foreignKey: 'petitStockId' })

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
    total: DataTypes.INTEGER,
    petitStockId: DataTypes.INTEGER,
    stockRequesitionId : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PetitStockRequesition',
  });
  return PetitStockRequesition;
};