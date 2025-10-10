const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event_controller");

// Search with pagination (Updated to use query parameters like /search?q=test&page=1&limit=10)
router.get("/search", eventController.EventsSearch);

// Get all events
router.get("/", eventController.getEvents);

// Get single event by event_id
router.get("/:eventId", eventController.getEvent);

// Add a new event
router.post("/", eventController.addEvent);

// Update event by event_id
router.put("/:eventId", eventController.updateEvent);

// Delete event by event_id
router.delete("/:eventId", eventController.deleteEvent);

// The route causing the crash has been removed.

module.exports = router;