'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Proforma extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.ProformaDetail,  { foreignKey: 'invoiceId' })
      this.belongsTo( models.User, { foreignKey : 'proformaId' } );
    }
  }
  Proforma.init({
    clientName: DataTypes.STRING,
    clientType: DataTypes.STRING,
    function: DataTypes.STRING,
    status: DataTypes.STRING,
    total: DataTypes.FLOAT,
    userId : DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'Proforma',
  });
  return Proforma;
};