const { Event } = require("../models");

const createEvent = async (eventData) => {
  const event = await Event.create(eventData);
  return event;
};

const getEvents = async () => {
  return await Event.findAll();
};

const getEventById = async (id) => {
  return await Event.findByPk(id);
};

const updateEvent = async (id, eventData) => {
  const event = await Event.findByPk(id);
  if (!event) {
    return null;
  }
  await event.update(eventData);
  return event;
};

const deleteEvent = async (id) => {
  const event = await Event.findByPk(id);
  if (!event) {
    return false;
  }
  await event.destroy();
  return true;
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
