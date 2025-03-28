const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");

// Endpoint pour l'achat de billets et l'envoi de confirmation
router.post("/buy", ticketController.buyTicket);

module.exports = router;
