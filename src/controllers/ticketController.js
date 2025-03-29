const ticketService = require("../services/ticketService");

exports.buyTicket = async (req, res) => {
  const { userId, eventId, paymentInfo } = req.body;
  try {
    const ticket = await ticketService.buyTicket(userId, eventId, paymentInfo);
    res.status(201).json({ message: req.t("ticketPurchased"), ticket });
  } catch (error) {
    console.error("Error purchasing ticket:", error);
    res.status(400).json({ message: req.t("ticketPurchaseFailed") });
  }
};
