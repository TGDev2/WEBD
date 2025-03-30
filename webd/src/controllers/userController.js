exports.createUser = (req, res) => {
  res.status(201).json({ message: req.t("userCreated") });
};

exports.getUsers = (req, res) => {
  res.status(200).json({ message: req.t("listUsers") });
};

exports.getUserById = (req, res) => {
  res.status(200).json({ message: req.t("userDetails") });
};

exports.updateUser = (req, res) => {
  res.status(200).json({ message: req.t("userUpdated") });
};

exports.deleteUser = (req, res) => {
  res.status(200).json({ message: req.t("userDeleted") });
};
