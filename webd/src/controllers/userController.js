const userService = require("../services/userService");

exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    res.status(201).json({ message: req.t("userCreated"), user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({ message: req.t("listUsers"), users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: req.t("internalServerError") });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: req.t("userNotFound") });
    }
    res.status(200).json({ message: req.t("userDetails"), user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: req.t("internalServerError") });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: req.t("userNotFound") });
    }
    res.status(200).json({ message: req.t("userUpdated"), user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: req.t("internalServerError") });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const success = await userService.deleteUser(req.params.id);
    if (!success) {
      return res.status(404).json({ message: req.t("userNotFound") });
    }
    res.status(200).json({ message: req.t("userDeleted") });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: req.t("internalServerError") });
  }
};
