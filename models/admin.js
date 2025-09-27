const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');
const User = require('./user');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: { model: User, key: 'id' }
  },
  superAccess: { 
    type: DataTypes.BOOLEAN,
     defaultValue: false 
    },

},

{
  tableName: 'admins',
  timestamps: true,
  paranoid: true,
});

User.hasOne(Admin, { foreignKey: 'id', as: 'adminProfile' });
Admin.belongsTo(User, { foreignKey: 'id' });

module.exports = Admin;
