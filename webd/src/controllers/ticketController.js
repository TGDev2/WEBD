const ticketService = require("../services/ticketService");
const logger = require("../utils/logger");

exports.buyTicket = async (req, res) => {
  const { userId, eventId, paymentInfo } = req.body;
  try {
    const ticket = await ticketService.buyTicket(userId, eventId, paymentInfo);
    res.status(201).json({ message: req.t("ticketPurchased"), ticket });
  } catch (error) {
    logger.error("Error purchasing ticket:", error);
    res.status(400).json({ message: req.t("ticketPurchaseFailed") });
  }
};

exports.getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const tickets = await ticketService.getTicketsForUser(userId);
    res.status(200).json({ tickets });
  } catch (error) {
    logger.error("Error fetching user tickets:", error);
    res.status(500).json({ message: req.t("internalServerError") });
  }
};
