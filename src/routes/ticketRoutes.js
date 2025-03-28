const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Endpoint pour l'achat de billets protégé par authentification
router.post("/buy", authenticateToken, ticketController.buyTicket);

module.exports = router;
