const userDao = require("../dao/userDao");
const permissionDao = require("../dao/permissionDao");
const { isValidPassword } = require("../utils/validation");
const { generateLoginTokens, generateAccessToken } = require("../utils/generate-jwt");
const cache = require("memory-cache");
const { generateResetPaswToken } = require("../utils/generate-uuid");

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

const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(429).json({ message: "All Fields are Required" });
    }

    let user;
    if (identifier.includes("@")) {
      user = await userDao.findByEmail(identifier);
    } else {
      user = await userDao.findByUsername(identifier);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.verifyPassword(password)) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const { accessToken, refreshToken } = generateLoginTokens(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to login" });
  }
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.body.accessToken;

  //   Blacklisting tokens
  if (refreshToken) {
    cache.put(refreshToken, true, 7 * 24 * 60 * 60 * 1000);
  }
  if (accessToken) {
    cache.put(accessToken, true, 15 * 60 * 1000);
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logout success!" });
};

const refreshToken = async (req, res) => {
  try {
    const newAccessToken = generateAccessToken(req.userPayload.userId, req.userPayload.username, req.userPayload.role);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to generate token" });
  }
};

// const requestResetPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await userDao.findByEmail(email);
//     if (!user) {
//       return res.status(404).json({ message: "Email not found" });
//     }

//     const tokenPassword = generateResetPaswToken();
//     user.resetPasswordToken = tokenPassword;
//     user.resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000;

//     await user.save();


//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error when trying to request reset password" });
//   }
// };

module.exports = {
  register,
  login,
  logout,
  refreshToken,
};
