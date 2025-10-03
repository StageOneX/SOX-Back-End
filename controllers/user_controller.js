const { validationResult } = require("express-validator");
const sequelize = require("../util/db");
const User = require("../models/user");
const { Op } = require("sequelize");
const { encode } = require("../middlewares/crypt");


// Get single user by userName

exports.getUser = async (req, res, next) => {
  const userName = req.params.userName;

  await User.findOne({ where: { userName } })
    .then((result) => {
      if (!result) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(result);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err.original || err);
    });
};


// Get all users

exports.getUsers = async (req, res, next) => {
  await User.findAll()
    .then((result) => {
      if (result.length === 0) {
        const error = new Error("No users found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(result);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err.original || err);
    });
};


// Add / Signup user

exports.addUser = async (req, res, next) => {
  const t = await sequelize.transaction();
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, Entered data is incorrect");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const {
      userName,
      firstName,
      lastName,
      userPW,
      address,
      contactNo,
      whatsAppNo,
      email,
      nicNo,
      createdBy,
      isActive,
      userLevel,
      singUpCompanyName,
      profilePictureUrl,
      
    } = req.body;

    const newUser = await User.create(
      {
        
        userName,
        firstName,
        lastName,
        address,
        userPW,
        contactNo,
        whatsAppNo,
        email,
        nicNo,
        createdBy,
        isActive,
        userLevel,
        singUpCompanyName,
        profilePictureUrl,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    await t.rollback();
    if (!err.statusCode) err.statusCode = 500;
    next(err.original || err);
  }
};


// Update user

exports.updateUser = async (req, res, next) => {
  const t = await sequelize.transaction();
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, Entered data is incorrect");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userName = req.params.userName;
    const user = await User.findByPk(userName);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.update(req.body, { where: { userName }, transaction: t });
    await t.commit();

    const updatedUser = await User.findByPk(userName);
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    await t.rollback();
    if (!err.statusCode) err.statusCode = 500;
    next(err.original || err);
  }
};


// Delete user

exports.deleteUser = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const userName = req.params.userName;
    const user = await User.findOne({ where: { userName } });

    if (!user) return res.status(404).json({ message: "User not found" });

    await User.destroy({ where: { userName }, transaction: t });
    await t.commit();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    await t.rollback();
    if (!err.statusCode) err.statusCode = 500;
    next(err.original || err);
  }
};


// Mark user inactive

exports.inactiveUser = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const userName = req.params.userName;
    const user = await User.findOne({ where: { userName } });

    if (!user) return res.status(404).json({ message: "User not found" });

    await User.update({ isActive: "N" }, { where: { userName }, transaction: t });
    await t.commit();

    res.status(200).json({ message: "User marked inactive" });
  } catch (err) {
    await t.rollback();
    if (!err.statusCode) err.statusCode = 500;
    next(err.original || err);
  }
};


// Paginated search

exports.UsersSearch = async (req, res, next) => {
  const pageNo = parseInt(req.params.pageNo);
  const numOfLine = parseInt(req.params.numOfLine);
  let searchText = req.params.searchText;

  if (!searchText || searchText === "null") {
    return res.status(200).json([]);
  }

  const dynamicWhere = [
    { userName: { [Op.substring]: searchText } },
    { firstName: { [Op.substring]: searchText } },
    { lastName: { [Op.substring]: searchText } },
    { email: { [Op.substring]: searchText } },
    { nicNo: { [Op.substring]: searchText } },
  ];

  const whereClause = { [Op.or]: dynamicWhere };
  const offset = (pageNo - 1) * numOfLine;

  try {
    const userList = await User.findAll({ where: whereClause, offset, limit: numOfLine, order: [["createdAt", "ASC"]] });
    const pageCount = await User.count({ where: whereClause });
    const totalCount = await User.count();

    res.status(200).json({ List: userList, pageCount, allCount: totalCount });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err.original || err);
  }
};

// ================================
// Get short user info
// ================================
exports.getUserShort = async (req, res, next) => {
  await User.findAll({ attributes: ["nicNo", "firstName", "lastName"] })
    .then((result) => {
      if (result.length === 0) {
        const error = new Error("No users found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(result);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err.original || err);
    });
};
