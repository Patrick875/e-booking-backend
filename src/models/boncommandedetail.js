'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BonDeCommandeDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.BonDeCommande, { foreignKey : 'commandId' })
    }
  }
  BonDeCommandeDetail.init({
    description: DataTypes.STRING,
    commandId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    times: DataTypes.INTEGER,
    unitPrice: DataTypes.FLOAT,
    VAT: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'BonDeCommandeDetail',
  });
  return BonDeCommandeDetail;
};