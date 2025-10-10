const { validationResult } = require("express-validator");
const sequelize = require("../util/db");
const Event = require("../models/event");
const { Op } = require("sequelize");

// Get single event by event_id
exports.getEvent = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    // Use the correct primary key 'event_id' from your model
    const event = await Event.findOne({ where: { event_id: eventId } });

    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(event);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err.original || err);
  }
};

// Get all events
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll();
    // It's better to return a 200 OK with an empty array if no events are found
    res.status(200).json(events);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err.original || err);
  }
};

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

    // Use the EXACT field names from your corrected 'event.js' model
    const {
      tenant_id,
      code,
      event_name,
      slug,
      title,
      summary,
      organizer_id,
      created_by,
    } = req.body;

    const newEvent = await Event.create({
      tenant_id,
      code,
      event_name,
      slug,
      title,
      summary,
      organizer_id,
      created_by,
    }, { transaction: t });

    await t.commit();
    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (err) {
    await t.rollback();
    if (!err.statusCode) err.statusCode = 500;
    next(err.original || err);
  }
};

// Update event
exports.updateEvent = async (req, res, next) => {
  const t = await sequelize.transaction();
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      throw error;
    }

    const eventId = req.params.eventId;
    const event = await Event.findOne({ where: { event_id: eventId } });

    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    // Securely pull only the fields that are allowed to be updated
    const {
      title,
      subtitle,
      summary,
      description_html,
      status,
      visibility,
      updated_by,
    } = req.body;

    // Update the event instance with new values
    event.title = title || event.title;
    event.subtitle = subtitle || event.subtitle;
    event.summary = summary || event.summary;
    event.description_html = description_html || event.description_html;
    event.status = status || event.status;
    event.visibility = visibility || event.visibility;
    event.updated_by = updated_by;

    await event.save({ transaction: t });
    await t.commit();

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (err) {
    await t.rollback();
    if (!err.statusCode) err.statusCode = 500;
    next(err.original || err);
  }
};

// Delete event (will perform a soft delete because of 'paranoid: true' in your model)
exports.deleteEvent = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const eventId = req.params.eventId;
    const event = await Event.findOne({ where: { event_id: eventId } });

    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    await event.destroy({ transaction: t });
    await t.commit();

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    await t.rollback();
    if (!err.statusCode) err.statusCode = 500;
    next(err.original || err);
  }
};

// Paginated search using query parameters
exports.EventsSearch = async (req, res, next) => {
  try {
    const { q, page, limit } = req.query;

    const pageNo = parseInt(page) || 1;
    const numOfLine = parseInt(limit) || 10;
    const searchText = q || '';
    const offset = (pageNo - 1) * numOfLine;

    if (!searchText) {
      return res.status(200).json({ List: [], matchCount: 0, totalCount: await Event.count() });
    }

    // Search using the correct field names from your model
    const whereClause = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${searchText}%` } }, // iLike is for case-insensitive search in PostgreSQL
        { summary: { [Op.iLike]: `%${searchText}%` } },
        { event_name: { [Op.iLike]: `%${searchText}%` } },
      ],
    };

    const { rows: eventList, count: matchCount } = await Event.findAndCountAll({
      where: whereClause,
      offset,
      limit: numOfLine,
      order: [["createdAt", "DESC"]],
    });

    const totalCount = await Event.count();

    res.status(200).json({ List: eventList, matchCount, totalCount });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err.original || err);
  }
};