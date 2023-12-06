const User = require("../models/user");

const createUser = async (userData) => {
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};

const findByUsername = async (username) => {
  return User.findOne({ username }).populate("role");
};

const findByEmail = async (email) => {
  return User.findOne({ email }).populate("role");
};

module.exports = {
  createUser,
  findByUsername,
  findByEmail,
};
