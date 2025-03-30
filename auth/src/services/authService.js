const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

const registerUser = async (userData) => {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = await User.create({
    email: userData.email,
    password: hashedPassword,
    role: userData.role || "User",
  });
  return newUser;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
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
