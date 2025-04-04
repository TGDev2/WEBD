// auth/src/routes/userAdminRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/auth/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user. Accessible by Admin.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User creation failed
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin"),
  userController.createUser
);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Get all users. Accessible by Admin.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin"),
  userController.getUsers
);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     description: Get user details by ID. Accessible by Admin.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  userController.getUserById
);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update user information. Accessible by Admin.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to update
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  userController.updateUser
);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by ID. Accessible by Admin.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  userController.deleteUser
);

module.exports = router;
