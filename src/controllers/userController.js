exports.createUser = (req, res) => {
  res.status(201).json({ message: "User created (not implemented)" });
};

exports.getUsers = (req, res) => {
  res.status(200).json({ message: "List of users (not implemented)" });
};

exports.getUserById = (req, res) => {
  res
    .status(200)
    .json({ message: `User ${req.params.id} details (not implemented)` });
};

exports.updateUser = (req, res) => {
  res
    .status(200)
    .json({ message: `User ${req.params.id} updated (not implemented)` });
};

exports.deleteUser = (req, res) => {
  res
    .status(200)
    .json({ message: `User ${req.params.id} deleted (not implemented)` });
};
