const { validationResult } = require("express-validator");
const sequelize = require("../util/db");
const Event = require("../models/event");
const { Op } = require("sequelize");
const { encode } = require("../middlewares/crypt");


// Get single event by eventId

exports.getEvent = async (req, res, next) => {
  const eventId = req.params.eventId;

  await Event.findOne({ where: { eventId } })
    .then((result) => {
      if (!result) {
        const error = new Error("Event not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(result);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err.original || err);
    });
}


// Get all events

exports.getEvents = async (req, res, next) => { 
  await Event.findAll()
    .then((result) => {
      if (result.length === 0) {
        const error = new Error("No events found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(result);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err.original || err);
    });
}

// Add / Create event

exports.addEvent = async (req, res, next) => {
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
      eventName,
      eventDate,
      location,
      description,
    } = req.body;

    const eventId = await Event.create(
      {
        eventId,
        eventName,
        eventDate,
        location,
        description
      },
      { transaction: t }
    );
    
    await t.commit();
    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  }
  catch (err) {
    await t.rollback();
    if (!err.statusCode) err.statusCode = 500;
    next(err.original || err);
  }
}