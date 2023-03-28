'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.hasOne(models.User, { foreignKey: 'roleId'});
      // Role.belongsToMany(models.Permission, {through: models.RolePermission});
    }
  }
  Role.init({
    name: DataTypes.STRING,
    access: DataTypes.ARRAY(DataTypes.JSONB),
    permission: DataTypes.ARRAY(DataTypes.STRING),
    display_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'Roles'
  });
  return Role;
};