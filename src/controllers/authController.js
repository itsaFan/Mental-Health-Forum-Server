const userDao = require("../dao/userDao");
const permissionDao = require("../dao/permissionDao");
const { isValidPassword } = require("../utils/validation");
const { generateLoginTokens, generateAccessToken } = require("../utils/generate-jwt");
const cache = require("memory-cache");
const { generateResetPaswToken } = require("../utils/generate-uuid");
const { getResetPaswEmailContent, forgotUsernameEmailContent } = require("../utils/mail-template");
const { sendEmail } = require("../config/mailer-config");
const UserProfile = require("../models/profile");


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

    // Create a new user
    const newUser = await userDao.createUser({ username, email, password, role: role._id });

    // Create a user profile for the new user
    const userProfile = new UserProfile({ profileOwner: newUser._id });
    await userProfile.save();

    res.status(201).json({ message: "Register success!" });
  } catch (error) {
    console.error(error);D
    res.status(500).json({ message: "Error when registering user" });
  }
};


const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({ message: "All Fields are Required" });
    }

    let user;
    if (identifier.includes("@")) {
      user = await userDao.findByEmail(identifier);
    } else {
      user = await userDao.findByUsername(identifier);
    }

    if (!user) {
      return res.status(404).json({ message: "Username or Email not found" });
    }

    if (!user.verifyPassword(password)) {
      return res.status(400).json({ message: "Wrong password" });
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
    res.status(500).json({
      message: "Error when trying to generate token",
    });
  }
};

const requestResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userDao.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const tokenPassword = generateResetPaswToken();
    user.resetPasswordToken = tokenPassword;
    user.resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000;

    await user.save();

    const emailContent = getResetPaswEmailContent(tokenPassword);
    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      html: emailContent,
    });

    res.status(200).json({
      message: "Password reset link sent to email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error when trying to request reset password",
    });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message: "Password needs to be at least 8 characters long and contain both numerical and alphabetical letters.",
      });
    }

    const user = await userDao.findByResetTokenAndExpireDate(resetToken);
    if (!user) {
      return res.status(400).json({
        message: "Invalid or token already expired",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Reset Password success!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to reset password" });
  }
};

const forgotUsername = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userDao.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const emailContent = forgotUsernameEmailContent(user.username);
    await sendEmail({
      to: user.email,
      subject: "Username Assitance",
      html: emailContent,
    });

    res.status(200).json({
      message: "Your request for username has been seen successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error when trying to send username, due to internal server",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  requestResetPassword,
  resetPassword,
  forgotUsername,
};
