const eventService = require("../services/eventService");
const logger = require("../utils/logger");

exports.createEvent = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).json({ message: req.t("eventCreated"), event });
  } catch (error) {
    logger.error("Error creating event:", error);
    res.status(500).json({ message: req.t("internalServerError") });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await eventService.getEvents();
    res.status(200).json({ events });
  } catch (error) {
    logger.error("Error fetching events:", error);
    res.status(500).json({ message: req.t("internalServerError") });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: req.t("eventNotFound") });
    }
    res.status(200).json({ event });
  } catch (error) {
    logger.error("Error fetching event:", error);
    res.status(500).json({ message: req.t("internalServerError") });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await eventService.updateEvent(
      req.params.id,
      req.body
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: req.t("eventNotFound") });
    }
    res
      .status(200)
      .json({ message: req.t("eventUpdated"), event: updatedEvent });
  } catch (error) {
    logger.error("Error updating event:", error);
    res.status(500).json({ message: req.t("internalServerError") });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const success = await eventService.deleteEvent(req.params.id);
    if (!success) {
      return res.status(404).json({ message: req.t("eventNotFound") });
    }
    res.status(200).json({ message: req.t("eventDeleted") });
  } catch (error) {
    logger.error("Error deleting event:", error);
    res.status(500).json({ message: req.t("internalServerError") });
  }
};
