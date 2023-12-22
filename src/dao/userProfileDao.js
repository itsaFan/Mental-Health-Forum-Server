const UserProfile = require("../models/profile");


const getUserProfile = async (userId) => {
  try {
    const userProfile = await UserProfile.findOne({ profileOwner: userId })
    .populate("profileOwner", "username email");

    return userProfile;
  } catch (error) {
    throw error;
  }
};

const updateUserProfile = async (userId, updateData) => {
  try {
    const updatedUserProfile = await UserProfile.findOneAndUpdate(
      { profileOwner: userId },
      updateData,
      { new: true, runValidators: true }
    );

    return updatedUserProfile;
  } catch (error) {
    throw error;
  }
};

const getUserProfileById = async (userId) => {
  try {
    const userProfile = await UserProfile.findOne({ profileOwner: userId })
    .populate("profileOwner", "username"); 

    return userProfile;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserProfileById
};
