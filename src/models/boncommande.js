'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BonDeCommande extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.BonDeCommandeDetail,  { foreignKey: 'commandId' })
      this.belongsTo( models.User, { foreignKey : 'userId' } );
    }
  }
  BonDeCommande.init({
    company: DataTypes.STRING,
    guest_name: DataTypes.STRING,
    function: DataTypes.STRING,
    fax : DataTypes.INTEGER,
    date_from: DataTypes.DATE,
    userId : DataTypes.INTEGER,
    date_to: DataTypes.DATE,
    total : DataTypes.FLOAT,
    BonCommandeId: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BonDeCommande',
  });
  return BonDeCommande;
};