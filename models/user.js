const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenantId: {
     type: DataTypes.UUID,
      allowNull: false 
    },
  email: {
     type: DataTypes.STRING, 
     allowNull: true, 
     validate: { isEmail: true } 
    },
  phone: {
     type: DataTypes.STRING, 
     allowNull: true 
    },
  passwordHash: {
     type: DataTypes.STRING, 
     allowNull: false 
    },
  displayName: {
     type: DataTypes.STRING 
    },
  avatarUrl: {
     type: DataTypes.STRING 
    },
  role: {
     type: DataTypes.STRING, 
     allowNull: false 
    }, // "attendee", "exhibitor", "organizer", "admin"
  status: {
     type: DataTypes.STRING, 
     defaultValue: 'active' 
    },
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true,
});

module.exports = User;
