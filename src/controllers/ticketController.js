const ticketService = require("../services/ticketService");

exports.buyTicket = (req, res) => {
  const { userId, eventId } = req.body;
  try {
    const ticket = ticketService.buyTicket(userId, eventId);
    res.status(201).json({ message: "Ticket purchased successfully", ticket });
  } catch (error) {
    console.error("Error purchasing ticket:", error);
    res.status(400).json({ message: error.message });
  }
};
