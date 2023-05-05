'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeliveryNote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.DeliveryNoteDetail, { foreignKey: 'deliveryId' })

    }
  }
  DeliveryNote.init({
    company: DataTypes.STRING,
    guest_name: DataTypes.STRING,
    total : DataTypes.FLOAT,
    deliveryNoteId: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DeliveryNote',
  });
  return DeliveryNote;
};