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

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
