const userDao = require("../dao/userDao");

const getAllUsers = async (req, res) => {
  try {
    const users = await userDao.getAllUsers();
    res.json({ message: "Successfully retrieved all users", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when fetching users" });
  }
};

module.exports = {
  getAllUsers,
};
