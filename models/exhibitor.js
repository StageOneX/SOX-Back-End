const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');
const User = require('./user');

const Exhibitor = sequelize.define('Exhibitor', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: { model: User, key: 'id' }
  },
  companyName: {
    type: DataTypes.STRING
  },
  boothNumber: {
    type: DataTypes.STRING
  },
  products: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
}, {
  tableName: 'exhibitors',
  timestamps: true,
  paranoid: true,
});

User.hasOne(Exhibitor, { foreignKey: 'id', as: 'exhibitorProfile' });
Exhibitor.belongsTo(User, { foreignKey: 'id' });

module.exports = Exhibitor;
