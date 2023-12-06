const User = require("../models/user");

const createUser = async (userData) => {
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};

const findByUsername = async (username) => {
  return User.findOne({ username });
};

module.exports = {
  createUser,
  findByUsername,
};
