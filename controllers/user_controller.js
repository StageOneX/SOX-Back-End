const User = require('../models/user');
const Attendee = require('../models/attendee');
const Exhibitor = require('../models/Exhibitor');
const Admin = require('../models/admin');
// Create a user
exports.createUser = async (req, res) => {
  try {
    const { tenantId, email, phone, passwordHash, displayName, role } = req.body;

    const user = await User.create({ tenantId, email, phone, passwordHash, displayName, role });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'User creation failed' });
  }
};

//  Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

//  Get user by ID (with role profile)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [
        { model: Attendee, as: 'attendeeProfile' },
        { model: Exhibitor, as: 'exhibitorProfile' },
        { model: Admin, as: 'adminProfile' },
      ]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching user' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await User.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ error: 'User not found' });

    const updatedUser = await User.findByPk(id);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating user' });
  }
};

//  Delete user (soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting user' });
  }
};
