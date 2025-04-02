const authService = require("../services/authService");
const logger = require("../utils/logger");

exports.register = async (req, res) => {
  try {
    const newUser = await authService.registerUser(req.body);
    return res
      .status(201)
      .json({ message: req.t("userRegistered"), user: newUser });
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await authService.loginUser(email, password);
    return res
      .status(200)
      .json({ message: req.t("loginSuccessful"), user, token });
  } catch (error) {
    logger.error(`Error during login: ${error.message}`);
    return res.status(401).json({ message: req.t("invalidCredentials") });
  }
};
