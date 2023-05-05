'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProformaDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Proforma, { foreignKey : 'invoiceId' })

    }
  }
  ProformaDetail.init({
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    times: DataTypes.INTEGER,
    VAT: DataTypes.STRING,
    proformaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProformaDetail',
  });
  return ProformaDetail;
};