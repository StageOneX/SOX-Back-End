const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');
const User = require('./user');

const Attendee = sequelize.define('Attendee', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: { model: User, key: 'id' }
  },
  interests: {
     type: DataTypes.JSONB, defaultValue: []
     },
  ticketType: {
    type: DataTypes.STRING, defaultValue: 'free'
  },
  checkedIn: {
    type: DataTypes.BOOLEAN, defaultValue: false
  },
}, {
  tableName: 'attendees',
  timestamps: true,
  paranoid: true,
});

User.hasOne(Attendee, { foreignKey: 'id', as: 'attendeeProfile' });
Attendee.belongsTo(User, { foreignKey: 'id' });

module.exports = Attendee;
