// auth/src/services/userService.js
const { User } = require("../models");

const createUser = async (userData) => {
  return await User.create(userData);
};

const getUserById = async (id) => {
  return await User.findByPk(id);
};

const getUsers = async () => {
  return await User.findAll();
};

const updateUser = async (id, updateData) => {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  await user.update(updateData);
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    return false;
  }
  await user.destroy();
  return true;
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
};
