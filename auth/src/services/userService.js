const { User } = require("../models");
const bcrypt = require("bcryptjs");

const createUser = async (userData) => {
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
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
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
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
