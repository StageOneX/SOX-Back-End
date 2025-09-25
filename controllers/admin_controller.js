const { Admin } = require('../models');

exports.createAdmin = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(201).json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Admin creation failed' });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching admins' });
  }
};
