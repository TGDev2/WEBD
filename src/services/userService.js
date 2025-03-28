let users = [];
let nextUserId = 1;

const createUser = (userData) => {
  const user = { id: nextUserId++, ...userData };
  users.push(user);
  return user;
};

const getUserByEmail = (email) => users.find((u) => u.email === email);

const getUserById = (id) => users.find((u) => u.id === parseInt(id, 10));

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
