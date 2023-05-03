'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BonCommandeDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.BonCommande, { foreignKey : 'commandId' })
    }
  }
  BonCommandeDetail.init({
    description: DataTypes.STRING,
    commandId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    times: DataTypes.INTEGER,
    unitPrice: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'BonCommandeDetail',
  });
  return BonCommandeDetail;
};