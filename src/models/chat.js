'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User , { foreignKey: 'sender' })
      this.belongsTo(models.User, { foreignKey: 'receiver' })
    }
  }
  Chat.init({
    sender: DataTypes.INTEGER,
    receiver: DataTypes.INTEGER,
    message: DataTypes.STRING,
    notifyAdmin: DataTypes.BOOLEAN,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};