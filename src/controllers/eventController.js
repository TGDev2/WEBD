exports.createEvent = (req, res) => {
  // Implémentation provisoire
  res.status(201).json({ message: "Event created (not implemented)" });
};

exports.getEvents = (req, res) => {
  res.status(200).json({ message: "List of events (not implemented)" });
};

exports.getEventById = (req, res) => {
  res
    .status(200)
    .json({ message: `Event ${req.params.id} details (not implemented)` });
};

exports.updateEvent = (req, res) => {
  res
    .status(200)
    .json({ message: `Event ${req.params.id} updated (not implemented)` });
};

exports.deleteEvent = (req, res) => {
  res
    .status(200)
    .json({ message: `Event ${req.params.id} deleted (not implemented)` });
};
