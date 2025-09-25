const { Attendee } = require('../models');

// Create attendee profile
exports.createAttendee = async (req, res) => {
  try {
    const attendee = await Attendee.create(req.body);
    res.status(201).json(attendee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Attendee creation failed' });
  }
};

// Get all attendees
exports.getAttendees = async (req, res) => {
  try {
    const attendees = await Attendee.findAll();
    res.json(attendees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching attendees' });
  }
};
