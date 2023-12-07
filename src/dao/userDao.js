const User = require("../models/user");

const createUser = async (userData) => {
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};

const getAllUsers = async () => {
  return User.find().select("-password").populate("role");
};

const findByUsername = async (username) => {
  return User.findOne({ username }).populate("role");
};

const findByEmail = async (email) => {
  return User.findOne({ email }).populate("role");
};

const findByResetTokenAndExpireDate = async (token) => {
  return await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });
};

module.exports = {
  createUser,
  findByUsername,
  findByEmail,
  findByResetTokenAndExpireDate,
  getAllUsers
};
