const { User } = require("../models");

const createUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

const getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
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
  getUserByEmail,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
};
