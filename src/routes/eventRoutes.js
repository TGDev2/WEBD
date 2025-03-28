const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");

// Endpoints CRUD pour les événements
// Seules les personnes avec les rôles "Admin" ou "EventCreator" peuvent créer, modifier ou supprimer un événement.
router.post("/", authenticateToken, authorizeRoles("Admin", "EventCreator"), eventController.createEvent);
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);
router.put("/:id", authenticateToken, authorizeRoles("Admin", "EventCreator"), eventController.updateEvent);
router.delete("/:id", authenticateToken, authorizeRoles("Admin", "EventCreator"), eventController.deleteEvent);

module.exports = router;
