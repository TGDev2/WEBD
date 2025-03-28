const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userService = require("./userService");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

const registerUser = async (userData) => {
  if (userService.getUserByEmail(userData.email)) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = userService.createUser({
    ...userData,
    password: hashedPassword,
  });
  return newUser;
};

const loginUser = async (email, password) => {
  const user = userService.getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
};
