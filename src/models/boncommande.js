'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BonCommande extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.BonCommandeDetail,  { foreignKey: 'commandId' })
      this.belongsTo( models.User, { foreignKey : 'userId' } );
    }
  }
  BonCommande.init({
    company: DataTypes.STRING,
    guest_name: DataTypes.STRING,
    date_from: DataTypes.DATE,
    userId : DataTypes.INTEGER,
    date_to: DataTypes.DATE,
    total : DataTypes.FLOAT,
    BonCommandeId: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BonCommande',
  });
  return BonCommande;
};