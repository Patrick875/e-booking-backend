'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvoiceDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Invoiced, { foreignKey : 'invoiceId' })

    }
  }
  InvoiceDetail.init({
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    times: DataTypes.INTEGER,
    VAT: DataTypes.STRING,
    invoiceId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'InvoiceDetail',
  });
  return InvoiceDetail;
};