const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const newUser = await authService.registerUser(req.body);
    res.status(201).json({ message: req.t("userRegistered"), user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await authService.loginUser(email, password);
    res.status(200).json({ message: req.t("loginSuccessful"), user, token });
  } catch (error) {
    res.status(401).json({ message: req.t("invalidCredentials") });
  }
};
