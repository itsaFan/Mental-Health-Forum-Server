const userDao = require("../dao/userDao");
const permissionDao = require("../dao/permissionDao");
const { isValidPassword } = require("../utils/validation");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const usernameExist = await userDao.findByUsername(username);
    if (usernameExist) {
      return res.status(403).json({
        message: "Username already taken",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: "Password needs to be at least 8 characters long and contain both numerical and alphabetical letters.",
      });
    }

    const role = await permissionDao.assignUserRole();
    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    await userDao.createUser({ username, email, password, role: role._id });
    res.status(201).json({ message: "Register success!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when registering user" });
  }
};

module.exports = {
  register,
};
