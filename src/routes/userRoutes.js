const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");

// Endpoints CRUD pour les utilisateurs
// Accès réservé aux administrateurs.
router.post("/", authenticateToken, authorizeRoles("Admin"), userController.createUser);
router.get("/", authenticateToken, authorizeRoles("Admin"), userController.getUsers);
router.get("/:id", authenticateToken, authorizeRoles("Admin"), userController.getUserById);
router.put("/:id", authenticateToken, authorizeRoles("Admin"), userController.updateUser);
router.delete("/:id", authenticateToken, authorizeRoles("Admin"), userController.deleteUser);

module.exports = router;
