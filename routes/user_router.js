const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");

// Get single user by userName
router.get("/:userName", userController.getUser);

// Get all users
router.get("/", userController.getUsers);

// Add a new user
router.post("/", userController.addUser);

// Update user by userName
router.put("/:userName", userController.updateUser);

// Delete user by userName
router.delete("/:userName", userController.deleteUser);

// Mark user inactive
router.put("/:userName/inactive", userController.inactiveUser);

// Get short user info
router.get("/short/info", userController.getUserShort);

module.exports = router;
