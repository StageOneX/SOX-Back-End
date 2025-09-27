const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
//const bcrypt = require("crypto");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    userName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    userPW: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    whatsAppNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nicNo: {
      type: DataTypes.STRING,
      allowNull: true,
        unique: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.STRING,
      defaultValue: "Y", // Active by default
    },
    userLevel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    singUpCompanyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePictureUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    paranoid: true,
  }
);

// Hooks – password hashing


const bcrypt = require("bcrypt"); // ✅ correct package

User.beforeCreate(async (user) => {
  if (user.userPW) {
    user.userPW = await bcrypt.hash(String(user.userPW), 10);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed("userPW")) {
    user.userPW = await bcrypt.hash(String(user.userPW), 10);
  }
});

// Instance method – compare password
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.userPW);
};


// Instance method – compare password

User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.userPW);
};

module.exports = User;
