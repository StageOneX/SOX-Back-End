const { Exhibitor } = require('../models');

exports.createExhibitor = async (req, res) => {
  try {
    const exhibitor = await Exhibitor.create(req.body);
    res.status(201).json(exhibitor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Exhibitor creation failed' });
  }
};

exports.getExhibitors = async (req, res) => {
  try {
    const exhibitors = await Exhibitor.findAll();
    res.json(exhibitors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching exhibitors' });
  }
};
