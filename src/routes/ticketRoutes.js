const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { authenticateToken } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/tickets/buy:
 *   post:
 *     summary: Purchase a ticket
 *     description: Purchase a ticket for an event. Requires authentication.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               eventId:
 *                 type: integer
 *               paymentInfo:
 *                 type: object
 *                 properties:
 *                   cardNumber:
 *                     type: string
 *     responses:
 *       201:
 *         description: Ticket purchased successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ticket:
 *                   type: object
 *       400:
 *         description: Ticket purchase failed
 */
router.post("/buy", authenticateToken, ticketController.buyTicket);

module.exports = router;
