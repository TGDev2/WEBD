const eventService = require("../services/eventService");

exports.createEvent = (req, res) => {
  try {
    const event = eventService.createEvent(req.body);
    res.status(201).json({ message: "Event created", event });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getEvents = (req, res) => {
  try {
    const events = eventService.getEvents();
    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getEventById = (req, res) => {
  try {
    const event = eventService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateEvent = (req, res) => {
  try {
    const updatedEvent = eventService.updateEvent(req.params.id, req.body);
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event updated", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteEvent = (req, res) => {
  try {
    const success = eventService.deleteEvent(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
